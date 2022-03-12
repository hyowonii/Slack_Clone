import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR, { mutate } from 'swr';

const Workspace: FC = ({ children }) => {   // FC : children 사용할때

  const { data, error } = useSWR('http://localhost:3095/api/users', fetcher, {
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

  if (!data) {
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