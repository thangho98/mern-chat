import { FileImageOutlined, PlusOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Popover, Tooltip } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import React, { useRef, useState } from 'react';
import { getBase64 } from '../utils/File';
import ImageUploadPreview from './ImageUploadPreview';

const MessageBox = ({ sendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const [visiblePopoverEmoji, setVisiblePopoverEmoji] = useState(false);
  const inputUploadRef = useRef(null);

  const [listFiles, SetListFiles] = useState([]);
  const [listPreviewFiles, SetListPreviewFiles] = useState([]);

  const handleSendMessage = () => {
    const value = messageText.trim();
    if (value || listFiles.length) {
      const messageObject = {
        text: messageText,
        files: listFiles
      };
      sendMessage(messageObject).then(() => {
        setMessageText('');
        SetListFiles([]);
        SetListPreviewFiles([]);
      }).catch((error) =>{

      });
    }
  };

  const content = (
    <Picker
      set="google"
      onSelect={(emoji, event) => {
        handleInsertEmoji(emoji);
      }}
    />
  );

  const handleInsertEmoji = (emoji) => {
    setMessageText(messageText + emoji.native);
  };

  const handleOpenFile = () => {
    inputUploadRef.current.click();
  };

  const onImageChange = (event) => {
    const files = event.target.files;
    console.log(files);
    if (files && files.length) {
      Object.keys(files).forEach((key) => {
        const file = files[key];
        if (typeof file === 'object') {
          getBase64(file).then((result) => {
            SetListPreviewFiles((listPreviewFiles) => [...listPreviewFiles, result]);
            SetListFiles((listFiles) => [...listFiles, file]);
          });
        }
      });
    }
  };

  const uploadButton = (
    <div
      className="btn-upload-image-preview"
      onClick={() => {
        handleOpenFile();
      }}
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onRemoveImage = (image, index) => {
    listFiles.splice(index, 1);
    listPreviewFiles.splice(index, 1);
    SetListPreviewFiles((listPreviewFiles) => [...listPreviewFiles]);
    SetListFiles((listFiles) => [...listFiles]);
  };
  return (
    <div className={`message-box ${listPreviewFiles.length ? 'preview-container' : ''}`}>
      <div className="message-input">
        {listPreviewFiles.length ? (
          <div className="preview-images-container">
            {listPreviewFiles.map((image, index) => (
              <ImageUploadPreview
                key={index}
                image={image}
                onClickRemoveImage={() => {
                  onRemoveImage(image, index);
                }}
              />
            ))}
            {/* {uploadButton} */}
          </div>
        ) : null}
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
        <Popover
          placement="topRight"
          className="btn-emoji"
          content={content}
          trigger="click"
          visible={visiblePopoverEmoji}
          onVisibleChange={setVisiblePopoverEmoji}
        >
          <Tooltip title="emoji">
            <Button
              size="large"
              shape="circle"
              icon={
                <SmileOutlined
                  style={{
                    color: '#0084ff',
                  }}
                />
              }
            />
          </Tooltip>
        </Popover>
      </div>
      <Tooltip className="message-btn" title="Press Enter to send">
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
        {listPreviewFiles.length ? null : (
          <Tooltip className="message-btn" title="Add files">
            <Button
              size="large"
              shape="circle"
              icon={
                <FileImageOutlined
                  style={{
                    color: '#0084ff',
                  }}
                />
              }
              onClick={() => {
                handleOpenFile();
              }}
            />
          </Tooltip>
        )}

      <input
          ref={inputUploadRef}
          onChange={(event) => onImageChange(event)}
          hidden
          className="file-upload"
          type="file"
          accept="image/*"
          multiple
        />
    </div>
  );
};

export default MessageBox;
