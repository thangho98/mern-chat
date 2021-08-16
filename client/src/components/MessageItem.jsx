import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import { MessageBox } from 'react-chat-elements';
import { stringToColour, stringToColourV2 } from '../utils/Colors';
const MessageItem = ({ position, type, reply, onReplyMessageClick, text, avatarUrl, fullName, senderId, backgroundColor, ...rest }) => {
  return (
    <div className="message-item">
      {avatarUrl ? (
        <Avatar
          src={avatarUrl}
          size="large"
          type="circle flexible"
          className={position === 'left' ? 'avatar-left' : 'avatar-right'}
        />
      ) : (
        <Avatar
          size="large"
          className={position === 'left' ? 'avatar-left' : 'avatar-right'}
          style={{ backgroundColor: stringToColourV2(senderId), verticalAlign: 'middle' }}
          size="large"
        >
          {fullName.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <MessageBox
        reply={reply}
        onReplyMessageClick={onReplyMessageClick}
        position={position}
        type={type}
        text={text}
        {...rest}
      />
    </div>
  );
};

export default MessageItem;
