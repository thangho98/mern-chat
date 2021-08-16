import { Content, Header } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React from 'react';

const Welcome = ({ currentUser }) => {
  return (
    <>
      <Header className="header"></Header>
      <Content className="content">
        <div className="centered">
          <Title>Welcome, {currentUser.fullName}</Title>
        </div>
      </Content>
    </>
  );
};

export default Welcome;
