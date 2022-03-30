import {Button, Input, Label} from "@pages/SignUp/styles";
import Modal from "@components/Modal";
import React, {useCallback, useState, VFC} from "react";
import useInput from "@hooks/useInput";
import axios from 'axios';
import {useParams} from "react-router";
import {toast} from "react-toastify";
import useSWR from "swr";
import {IChannel, IUser} from "@typings/db";
import fetcher from "@utils/fetcher";

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({show, onCloseModal, setShowCreateChannelModal}) => {
    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
    const {workspace, channel} = useParams<{workspace: string; channel: string}>();
    const { data: userData, error, mutate } = useSWR<IUser | false>(
        'http://localhost:3095/api/users',
        fetcher,
        {
            dedupingInterval: 2000,  // 2초(캐시 유지 시간)\
        },
    ); // swr: 컴포넌트들을 넘나드는 전역 스토리지
    const {data: channelData, mutate: mutateChannel} = useSWR<IChannel[]>(
        userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,   // swr 조건부요청 지원
        fetcher,
    );  // 서버로부터 채널데이터 받아옴
    const onCreateChannel = useCallback((e) => {
        e.preventDefault();
        axios.post(
            `http://localhost:3095/api/workspaces/${workspace}/channels`,
            {
                name: newChannel,
            }, {
                withCredentials: true,
            }
        ).then((response) => {
            setShowCreateChannelModal(false);
            mutateChannel(response.data, false);    // 생성하자마자 채널리스트 다시 불러오기
            setNewChannel('');
        }
        ).catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, {position: 'bottom-center'});
        });
    }, [newChannel]);

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널</span>
                    <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    );
};

export default CreateChannelModal;