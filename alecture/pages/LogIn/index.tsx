import React, { useCallback, useState } from 'react';
import useInput from '@hooks/useInput';
import { Header, Form, Label, Input, Button, LinkContainer } from '@pages/SignUp/styles';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {

  const { data: userData, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 100000,
  });
  const [email, onChangeEmail, setEmail] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');
  const [logInError, setLogInError] = useState(false);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    setLogInError(false);
    axios.post(
      'http://localhost:3095/api/users/login',
      { email, password },
      { withCredentials: true },
    )
      .then(() => {
        mutate();
      })
      .catch((error) => {
        setLogInError(error.response?.data?.statusCode === 401);
      })
  }, [email, password]);

  if (userData === undefined) {  // 재로딩될 때 창 떴다 사라짐 처리
    return <div>로딩중...</div>
  }

  if (userData) {
    return <Redirect to="/workspace/channel" />
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  )
}

export default LogIn;