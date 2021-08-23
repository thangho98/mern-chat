import {
  ClockCircleOutlined,
  PhoneOutlined,
  SearchOutlined,
  UserAddOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { Button, Col, Row, Space, Tooltip } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import useChat from '../hooks/useChat';
import { stringToColourV2 } from '../utils/Colors';
import MessageBox from './MessageBox';
import Messages from './Messages';

const Conversation = ({ currentUser, conversation }) => {
  const {
    messages,
    sendMessage,
    isFirstLoad,
    loadMoreOldMessages,
    isLoadMoreData,
    isStillOldMessage,
    handleUpdateReceiveNewMessagesDone,
    isReceiveNewMessage,
    isLoadMoreDataSuccess,
    handleUpdateLoadMoreDataSuccessDone
  } = useChat({ conversationId: conversation._id, userId: currentUser._id });

  const contact = conversation.members.find((member) => member._id !== currentUser._id);
  return (
    <>
      <Header className="header">
        <Row className="header-content">
          <Col className="header-left" span={12}>
            {contact ? (
              <Space align="start" size="middle">
                {contact.avatar ? (
                  <Avatar src={contact.avatar.url} size="large" />
                ) : (
                  <Avatar
                    style={{ backgroundColor: stringToColourV2(contact._id), verticalAlign: 'middle' }}
                    size="large"
                  >
                    {contact.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <div className="contact-info">
                  <div>
                    <Title level={4}>{contact.fullName}</Title>
                  </div>
                  <div className="contact-info__status">
                    <ClockCircleOutlined style={{ color: '#f5222d' }} />
                    <div className="account-status-text" type="secondary">
                      offline
                    </div>
                  </div>
                </div>
              </Space>
            ) : null}
          </Col>
          <Col span={12} className="header-right">
            <Space align="start" size="large">
              <Tooltip title="Search">
                <Button size="large" shape="circle" icon={<SearchOutlined />} />
              </Tooltip>
              <Tooltip title="Audio Call">
                <Button size="large" shape="circle" icon={<PhoneOutlined />} />
              </Tooltip>
              <Tooltip title="Video Call">
                <Button size="large" shape="circle" icon={<VideoCameraOutlined />} />
              </Tooltip>
              <Tooltip title="Create New Group">
                <Button size="large" shape="circle" icon={<UserAddOutlined />} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Header>
      <Content className="content">
        <Messages
          currentUser={currentUser}
          messages={messages}
          isFirstLoad={!isFirstLoad}
          onLoadMoreOldMessages={loadMoreOldMessages}
          isLoadMoreData={isLoadMoreData}
          isStillOldMessage={isStillOldMessage}
          onUpdateReceiveNewMessagesDone={handleUpdateReceiveNewMessagesDone}
          isReceiveNewMessage={isReceiveNewMessage}
          isLoadMoreDataSuccess={isLoadMoreDataSuccess}
          onUpdateLoadMoreDataSuccessDone={handleUpdateLoadMoreDataSuccessDone}
        />
      </Content>
      <Footer className="footer">
        <MessageBox sendMessage={sendMessage} />
      </Footer>
    </>
  );
};

export default Conversation;
