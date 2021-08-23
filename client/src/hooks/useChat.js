import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import HttpClient from '../utils/HttpClient';

const useChat = ({ conversationId, userId }) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);

  const skip = useRef(0);
  const [isFirstLoad, setFirstLoad] = useState(true);
  const [isStillOldMessage, setStillOldMessage] = useState(true);
  const [isLoadMoreData, setIsLoadMoreData] = useState(false);
  const [isReceiveNewMessage, setIsReceiveNewMessage] = useState(false);
  const [isLoadMoreDataSuccess, setIsLoadMoreDataSuccess] = useState(false);
  //when component mounts and changes
  useEffect(() => {
    socketRef.current = socketIOClient('http://localhost:5001');
    socketRef.current.emit('join', { conversationId, userId });

    socketRef.current.on('log', (message) => {
      console.log(message);
    });

    socketRef.current.on('mostRecentMessages', (data) => {
      //on start, set as messages the mostRecentMessages
      //in case the server restarts, we want to replace the current messages
      //with those from database
      //not add more
      setMessages((messages) => [...data.messages]);
      setStillOldMessage(data.isStillOldMessage);
      skip.current = data.messages.length;
      setFirstLoad(false);
    });

    socketRef.current.on('newChatMessage', (message) => {
      //append message to the end of array, after using spread operator
      // setMessages(messages => [...messages, {user_name: user_name, user_avatar: user_avatar, message_text: message_text}]);

      //this will not work
      //useeffect runs once, when the component first loads
      //acts as closure that has access to messages (parent scope)
      //when it first runs, messages is empty array
      //when you add new messages to the messages array, it is no longer empty
      //and the array is changed (not mutated, new array)
      //with this way you're no longer able to access the current value of messages here
      //you would have access only to the first value of messages (empty array)
      //and means you won't be able to append more messages
      //so instead we use the above, that's we use a callback that will get the latest value of messages
      //and then appends the latest data
      console.log("message: ", message);
      skip.current = skip.current + 1;
      setMessages((messages) => [...messages, message]);
      setIsReceiveNewMessage(true);
    });

    socketRef.current.on('dataOldMessages', (data) => {
      skip.current = data.messages.length + skip.current;
      setStillOldMessage(data.isStillOldMessage);
      setMessages((messages) => [...data.messages, ...messages]);
      setIsLoadMoreData(false);
      setIsLoadMoreDataSuccess(true);
    });

    socketRef.current.on('retryConnect', (data) => {
      console.log(data);
      socketRef.current.emit('join', { conversationId, userId });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  //message is part of an object
  const sendMessage = (messageObject) => {
    return new Promise((resolve, reject) => {
      if (messageObject.files && Array.isArray(messageObject.files) && messageObject.files.length) {
        const formData = new FormData();
        messageObject.files.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('text', messageObject.text);
        formData.append('conversationId', conversationId);
        formData.append('senderId', userId);
        HttpClient.post('/messages/send', formData)
          .then((message) => {
            console.log(message);
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } else {
        socketRef.current.emit('newChatMessage', {
          ...messageObject,
          conversationId,
          senderId: userId,
        });
        resolve();
      }
    })

  };

  // load more old messages
  const loadMoreOldMessages = () => {
    if (isStillOldMessage && !isLoadMoreData) {
      socketRef.current.emit('loadMoreOldMessage', {
        conversationId,
        skip: skip.current,
      });
      setIsLoadMoreData(true);
    }
  };

  const handleUpdateReceiveNewMessagesDone = () => {
    setIsReceiveNewMessage(false);
  };

  const handleUpdateLoadMoreDataSuccessDone = () => {
    setIsLoadMoreDataSuccess(false);
  };

  return {
    messages,
    sendMessage,
    isFirstLoad,
    loadMoreOldMessages,
    isLoadMoreData,
    isStillOldMessage,
    handleUpdateReceiveNewMessagesDone,
    isReceiveNewMessage,
    isLoadMoreDataSuccess,
    handleUpdateLoadMoreDataSuccessDone,
  };
};

export default useChat;
