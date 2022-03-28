import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR, { mutate } from 'swr';
import { AddButton, Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceModal, WorkspaceName, Workspaces, WorkspaceWrapper } from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMsg = loadable(() => import('@pages/Channel'));

const Workspace: FC = ({ children }) => {   // FC : children 사용할때

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { data: userData, error } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000  // 2초(캐시 유지 시간)
  }); // swr: 컴포넌트들을 넘나드는 전역 스토리지

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,  // 쿠키 공유하기
    })
      .then(() => {
        mutate('http://localhost:3095/api/users', false, false);
      });
  }, []);

  const onClickUserProfile = useCallback(() => {  // 토글 함수
    setShowUserMenu((prev) => !prev)
  }, []);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();  // 이벤트 버블링 막기
    setShowUserMenu(false);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  const onCreateWorkspace = useCallback((e) => {
    e.preventDefault();
    if (!newWorkspace || !newWorkspace.trim()) return;   // 띄어쓰기만 있어도 통과되는 것을 방지하기 위해 trim까지
    if (!newUrl || !newUrl.trim()) return;
    axios.post('http://localhost:3095/api/workspaces', {
      workspace: newWorkspace,
      url: newUrl,
    }, {
      withCredentials: true,
    },
    )
      .then(() => {
        //mutate(false, false);
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');    // input창 비워두기
        setNewUrl('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [newWorkspace, newUrl]);

  if (!userData) {
    return <Redirect to="/login" />
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname}></ProfileImg>
            {showUserMenu &&
              <Menu style={{ right: 0, top: 38 }} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname}></img>
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            }
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>{userData.Workspaces.map((ws) => {
          return (
            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
              <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
            </Link>
          );
        })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMsg} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  )
}

export default Workspace;