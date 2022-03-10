import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

const Workspace: FC = ({ children }) => {   // FC : children 사용할때

  const { data: userData, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher); // swr: 컴포넌트들을 넘나드는 전역 스토리지

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,  // 쿠키 공유하기
    })
      .then(() => {
        mutate();
      });
  }, []);

  if (!userData) {
    return <Redirect to="/login" />
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  )
}

export default Workspace;