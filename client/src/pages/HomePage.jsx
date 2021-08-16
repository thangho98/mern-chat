import {
  EditFilled,
  MessageOutlined,
  SearchOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Input, Layout, List, message, Tabs, Tooltip, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useRef, useState } from 'react';
import { ChatItem } from 'react-chat-elements';
import { useHistory } from 'react-router-dom';
import Conversation from '../components/Conversation';
import Welcome from '../components/Welcome';
import { TOKEN_USER } from '../contants/token';
import { stringToColourV2 } from '../utils/Colors';
import HttpClient from '../utils/HttpClient';
const { Header, Sider } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const HomePage = () => {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(null);
  const [listRecentConversations, setListRecentConversations] = useState([]);
  const [currentConversation, SetCurrentConversation] = useState(null);
  const inputUploadRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem(TOKEN_USER);
    if (!accessToken) {
      history.push('/login');
    }
    getProfileUser();
  }, []);

  const getProfileUser = () => {
    HttpClient.get('/users/profile', {
      clearCacheEntry: true,
    })
      .then((result) => {
        console.log({
          data: result.data,
        });
        setCurrentUser(result.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem(TOKEN_USER);
          history.push('/login');
        } else {
          message.error('Something went wrong!');
          console.error({
            error,
          });
        }
      });
  };

  useEffect(() => {
    HttpClient.get('/conversations/recent')
      .then((result) => {
        setListRecentConversations(result.data);
      })
      .catch((error) => {
        message.error('Something went wrong!');
        console.error({
          error,
        });
      });
  }, []);

  const handleChangeConversation = (conversation) => {
    if (currentConversation !== conversation) {
      SetCurrentConversation(conversation);
    }
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOpenFile = () => {
    inputUploadRef.current.click();
  };

  const onImageChange = (event) => {
    const files = event.target.files;
    console.log(files);
    if (files && files[0]) {
      const avatar = files[0];
      const formData = new FormData();
      formData.append('avatar', avatar);
      HttpClient.post('/users/profile/avatar', formData)
        .then(() => {
          getProfileUser();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  console.log({ currentUser });
  return (
    <Layout className="layout">
      <Sider className="sider" width="300" theme="light">
        <Header className="sider-header">
          {currentUser ? (
            <div className="user-info" onClick={() => showModal()}>
              {currentUser.avatar ? (
                <Avatar src={currentUser.avatar.url} size="large" />
              ) : (
                <Avatar
                  style={{ backgroundColor: stringToColourV2(currentUser._id), verticalAlign: 'middle' }}
                  size="large"
                >
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <Title className="user-info__full-name" level={4}>
                {currentUser.fullName}
              </Title>
            </div>
          ) : null}
          <Input placeholder="People, groups" prefix={<SearchOutlined />} />
        </Header>
        <Tabs className="sider-tab" tabPosition="bottom" size="large" centered>
          <TabPane tab={<MessageOutlined />} key="1">
            {currentUser ? (
              <List
                itemLayout="horizontal"
                dataSource={listRecentConversations}
                renderItem={(conversation) => {
                  let title = conversation.name;
                  let avatar;
                  let letterId;
                  if (conversation.type === 'direct') {
                    const contact = conversation.members.find((member) => member._id !== currentUser._id);
                    if (contact) {
                      title = contact.fullName;
                      avatar = contact.avatar ? contact.avatar.url : null;
                      letterId = contact._id;
                    }
                  }
                  return (
                    <ChatItem
                      avatar={avatar || undefined}
                      title={title}
                      subtitle={conversation.lastMessage}
                      date={new Date(conversation.updatedAt)}
                      unread={0}
                      letterItem={
                        avatar
                          ? undefined
                          : {
                              letter: title.charAt(0).toUpperCase(),
                              id: letterId,
                            }
                      }
                      onClick={() => {
                        handleChangeConversation(conversation);
                      }}
                    />
                  );
                }}
              />
            ) : null}
          </TabPane>
          <TabPane tab={<UserOutlined />} key="2">
            Content of Tab 2
          </TabPane>
          <TabPane tab={<TeamOutlined />} key="3">
            Content of Tab 3
          </TabPane>
        </Tabs>
      </Sider>
      {currentUser ? (
        <Layout className="layout">
          {currentConversation ? (
            <Conversation conversation={currentConversation} currentUser={currentUser} />
          ) : (
            <Welcome currentUser={currentUser} />
          )}
        </Layout>
      ) : null}

      {currentUser ? (
        <Modal
          className="user-profile"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          footer={null}
        >
          <div className="user-profile__header">
            <div className="user-profile__container-avatar">
              <div
                onClick={() => {
                  handleOpenFile();
                }}
                className="user-profile__avatar"
              >
                {currentUser.avatar ? (
                  <Avatar src={currentUser.avatar.url} size={128} />
                ) : (
                  <Avatar
                    style={{ backgroundColor: stringToColourV2(currentUser._id), verticalAlign: 'middle' }}
                    size={128}
                  >
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <div className="overlay">
                  <UploadOutlined
                    style={{
                      fontSize: '64px',
                    }}
                  />
                </div>
                <input
                  ref={inputUploadRef}
                  onChange={(event) => onImageChange(event)}
                  hidden
                  className="file-upload"
                  type="file"
                  accept="image/*"
                />
              </div>
            </div>
            <div className="user-profile__container-full-name">
              <Title>{currentUser.fullName}</Title>
              <Tooltip className="btn-edit-name" title="Edit Name">
                <span className="clickable">
                  <EditFilled
                    style={{
                      fontSize: '24px',
                    }}
                  />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="user-profile__content"></div>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default HomePage;
