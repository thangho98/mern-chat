import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import MessageItem from './MessageItem';
const MIN_OFFSET_ALLOW_LOAD_MORE_DATA = 10;
const Messages = ({
  messages,
  currentUser,
  autoScrollBottom,
  onLoadMoreOldMessages,
  isLoadMoreData,
  isStillOldMessage,
  isReceiveNewMessage,
  onUpdateReceiveNewMessagesDone,
  isLoadMoreDataSuccess,
  onUpdateLoadMoreDataSuccessDone,
}) => {
  const [isScrollFinished, setScrollFinished] = useState(false);
  const [isWaitingLatestMessages, setIsWaitingLatestMessages] = useState(true);
  const [offsetScrollContainer, setOffsetScrollContainer] = useState(0);

  useEffect(() => {
    const element = document.getElementById('message-container');
    element.addEventListener('scroll', onMessageContainerScroll);
    return () => {
      element.removeEventListener('scroll', onMessageContainerScroll);
    };
  }, [isLoadMoreData, isStillOldMessage]);

  const onMessageContainerScroll = () => {
    const element = document.getElementById('message-container');
    if (element.scrollTop <= MIN_OFFSET_ALLOW_LOAD_MORE_DATA) {
      if (!isLoadMoreData && isStillOldMessage) {
        onLoadMoreOldMessages();
      }
    }
    if (element.offsetHeight + element.scrollTop >= element.scrollHeight) {
      setIsWaitingLatestMessages(true);
    } else {
      setIsWaitingLatestMessages(false);
    }
    setOffsetScrollContainer(element.scrollHeight - element.scrollTop - element.offsetHeight);

    // if (element) {
    //   console.log({
    //     offsetHeight: element.offsetHeight,
    //     scrollTop: element.scrollTop,
    //     scrollHeight: element.scrollHeight,
    //   });
    // }
  };

  // const debounceLoadMore = debounce(1000, false, (num) => {
  //   onLoadMoreOldMessages();
  // });

  useEffect(() => {
    if (!isScrollFinished) {
      if (autoScrollBottom) {
        setTimeout(handleScrollBottom, 200);
        setScrollFinished(true);
      }
    }
  }, [autoScrollBottom, isScrollFinished]);

  useEffect(() => {
    if (isReceiveNewMessage) {
      if (isWaitingLatestMessages) {
        setTimeout(handleScrollBottom, 200);
      }
      onUpdateReceiveNewMessagesDone();
    }
  }, [isReceiveNewMessage, isWaitingLatestMessages]);

  useEffect(() => {
    if (isLoadMoreDataSuccess) {
      setTimeout(handleScrollOldPosition, 200);
      onUpdateLoadMoreDataSuccessDone();
    }
  }, [isLoadMoreDataSuccess]);

  const handleScrollBottom = () => {
    const element = document.getElementById('message-container');
    element.scrollTop = element.offsetHeight;
  };

  const handleScrollOldPosition = () => {
    const element = document.getElementById('message-container');
    element.scrollTop = element.scrollHeight - element.offsetHeight - offsetScrollContainer;
  };

  return (
    <div id="message-container" className="message-container">
      {isLoadMoreData ? (
        <div className="loading-more-message">
          <Spin size="large" />
        </div>
      ) : null}
      {messages.map((message) => {
        return (
          <MessageItem
            key={message._id}
            onReplyMessageClick={() => console.log('reply clicked!')}
            position={message.senderId === currentUser._id ? 'right' : 'left'}
            type={'text'}
            text={message.text}
            date={new Date(message.createdAt)}
            fullName={message.sender.fullName}
            senderId={message.senderId}
            avatarUrl={message.sender.avatar ? message.sender.avatar.url : null}
          />
        );
      })}

      {/* <SystemMessage text={'End of conversation'} /> */}
    </div>
  );
};

export default Messages;
