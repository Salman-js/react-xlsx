import { useState } from 'react';
import { Table, Button, Upload, message, Popconfirm, Tooltip } from 'antd';
import {
  DownloadOutlined,
  DeleteOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import ImportTableController from '../controllers/ImportTableController';
import TableData from '../models/TableData';
import axios from 'axios';
import { RcFile } from 'antd/lib/upload/interface';

const ImportTable = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
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
  const handleFileSelect = async (file: RcFile) => {
    setFile(file);
    try {
      const data = await ImportTableController.handleFileUpload(file);
      setTableData(data);
    } catch (error) {
      message.error('Failed to read the file.');
    }
  };

  const handleReset = () => {
    setTableData([]);
    setFile(null);
  };
  const handleDeleteRow = (record: TableData) => {
    const updatedData = tableData.filter((item) => item !== record);
    setTableData(updatedData);
  };

  const handleSaveRow = (
    record: TableData,
    dataIndex: string,
    value: string
  ) => {
    const updatedData = tableData.map((item) => {
      if (item === record) {
        return { ...item, [dataIndex]: value };
      }
      return item;
    });
    setTableData(updatedData);
  };

  const columns = tableData.length
    ? Object.keys(tableData[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
        render: (text: string, record: TableData) => (
          <input
            value={text}
            onChange={(e) => handleSaveRow(record, key, e.target.value)}
          />
        ),
      }))
    : [];

  const renderDeleteButton = (record: TableData) => (
    <Popconfirm
      title='Are you sure you want to delete this row?'
      onConfirm={() => handleDeleteRow(record)}
      okText='Yes'
      cancelText='No'
      okButtonProps={{
        className: 'bg-blue-500',
      }}
    >
      <Button icon={<DeleteOutlined />} size='small' />
    </Popconfirm>
  );

  return (
    <div>
      <div className='flex flex-row justify-start space-x-2'>
        <Upload
          accept='.xlsx'
          listType='picture-card'
          showUploadList={true}
          maxCount={1}
          beforeUpload={(file) => {
            handleFileSelect(file);
            return false;
          }}
        >
          <div>
            <DownloadOutlined />
            <div style={{ marginTop: 8 }}>Import</div>
          </div>
        </Upload>
        <div className='flex flex-col justify-between items-end'>
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
          {file && (
            <Tooltip title='reset'>
              <Button
                shape='circle'
                icon={<UndoOutlined />}
                onClick={() => handleReset()}
                className='flex justify-center items-center'
              />
            </Tooltip>
          )}
        </div>
      </div>
      <Table
        dataSource={tableData}
        columns={[...columns, { title: 'Actions', render: renderDeleteButton }]}
        rowKey={(record) => Object.values(record).join('_')}
        bordered
        footer={() => (
          <>
            {tableData.length && (
              <Button
                type='dashed'
                onClick={() => setTableData([...tableData, {}])}
                style={{ width: '100%' }}
              >
                Add Row
              </Button>
            )}
          </>
        )}
      />
    </div>
  );
};

export default ImportTable;
