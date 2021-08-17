import { CloseCircleOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import React from 'react';
const width = 75;
const ImageUploadPreview = ({ image, onClickRemoveImage }) => {
  return (
    <div className="img-upload-preview">
      <Image className="img-preview" width={width} height={width} src={image} />
      <div className="btn-remove-image" onClick={() => {
        if(onClickRemoveImage) onClickRemoveImage();
      }}>
        <CloseCircleOutlined
          style={{
            color: '#987a7a',
          }}
        />
      </div>
    </div>
  );
};

export default ImageUploadPreview;
