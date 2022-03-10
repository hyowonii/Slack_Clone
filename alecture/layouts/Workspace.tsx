import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback } from 'react';
import useSWR from 'swr';

const Workspace = () => {

  const { data: userData, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher); // swr: 컴포넌트들을 넘나드는 전역 스토리지

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,  // 쿠키 공유하기
    })
      .then(() => {
        mutate();
      });
  }, []);

  return (
    <button onClick={onLogout}>로그아웃</button>
  )
}