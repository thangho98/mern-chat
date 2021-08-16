import { SendOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';

const MessageBox = ({ sendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const handleSendMessage = () => {
    const value = messageText.trim();
    if (value) {
      const messageObject = {
        text: messageText,
      };
      sendMessage(messageObject);
    }
    setMessageText('');
  };
  return (
    <div className="message-box">
      <TextArea
        autoSize={{ minRows: 1, maxRows: 3 }}
        value={messageText}
        onChange={(event) => setMessageText(event.target.value)}
        className="message-box-input-textarea"
        placeholder="Type a message"
        onPressEnter={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            //prevents enter from being pressed
            event.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <div>
        <Tooltip title="Press Enter to send">
          <Button
            size="large"
            shape="circle"
            icon={
              <SendOutlined
                style={{
                  color: '#0084ff',
                }}
              />
            }
            onClick={() => {
              handleSendMessage();
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default MessageBox;
