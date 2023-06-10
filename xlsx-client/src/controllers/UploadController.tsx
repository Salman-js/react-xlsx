import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const UploadController = () => {
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async () => {
    if (!file) {
      message.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await axios.post('http://localhost:3000/upload', formData);
      message.success('File uploaded successfully');
      setFile(null);
    } catch (error) {
      console.error(error);
      message.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: any) => {
    setFile(file);
    return false;
  };

  return (
    <>
      <Upload
        beforeUpload={beforeUpload}
        accept='.xlsx'
        listType='picture-card'
        showUploadList={true}
        maxCount={1}
      >
        <div>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
      {file && (
        <Button
          type='primary'
          onClick={handleFileUpload}
          loading={uploading}
          disabled={uploading}
          className='bg-blue-500'
        >
          {uploading ? 'Uploading' : 'Upload'}
        </Button>
      )}
    </>
  );
};

export default UploadController;
