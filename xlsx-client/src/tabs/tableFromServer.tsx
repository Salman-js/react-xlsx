import { useState, useEffect } from 'react';
import { Table, Button, Tooltip, message, Popconfirm } from 'antd';
import {
  FileExcelOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UndoOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import TableData from '../models/TableData';
import ImportCloudTableController from '../controllers/ImportCloudTableController';
import axios from 'axios';
import ConvertToXlsxController from '../controllers/convertTableToXlsxController';

const ImportCloudTable = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [files, setFiles] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/files');
      setFiles(response.data.files);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch uploaded files');
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/files/${filename}`
      );
      message.success(response.data.message);
      fetchUploadedFiles();
      setTableData([]);
    } catch (error) {
      console.error(error);
      message.error('Failed to delete file');
    }
  };

  const handleSelect = async (name: string) => {
    setSelectedFileName(name);
    try {
      const data = await ImportCloudTableController.handleFileUpload(name);
      setTableData(data);
    } catch (error) {
      message.error('Failed to read the file.');
    }
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

  const handleReset = () => {
    setTableData([]);
    setSelectedFileName('');
  };

  const handleReplace = async (filename: string) => {
    setSelectedFileName(filename);
    try {
      const data = ConvertToXlsxController.exportToXLSX(tableData, filename);
      fetchUploadedFiles();
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    fetchUploadedFiles();
  }, []);
  return (
    <div>
      <div className='w-full flex flex-col flex-wrap p-4 rounded-lg my-2 border border-gray-300'>
        <div className='w-full flex flex-row justify-between'>
          <div className='flex flex-row space-x-3'>
            <div>
              <p className='text-2xl font-semibold text-gray-500 text-left'>
                Uploaded files
              </p>
            </div>
          </div>
          <div className='flex flex-row space-x-2'>
            <Tooltip title='reset'>
              <Button
                shape='circle'
                icon={<UndoOutlined />}
                onClick={() => handleReset()}
                className='flex justify-center items-center'
              />
            </Tooltip>
            <Tooltip title='refresh'>
              <Button
                shape='circle'
                icon={<ReloadOutlined />}
                onClick={() => fetchUploadedFiles()}
                className='flex justify-center items-center'
              />
            </Tooltip>
          </div>
        </div>
        <div className='w-full flex flex-row flex-wrap p-4 rounded-lg my-2'>
          {files.length &&
            files.map((file: { id: number; filename: string }) => (
              <div
                className={`p-3 rounded-lg space-x-2 flex flex-row m-2 ${
                  selectedFileName === file.filename && 'bg-gray-200'
                } border border-gray-300 cursor-pointer hover:bg-gray-200`}
                onClick={() => handleSelect(file.filename)}
                key={file.id}
              >
                <FileExcelOutlined className='text-2xl' />{' '}
                <span className='my-auto'>{file.filename}</span>
                <Popconfirm
                  title='Are you sure you want to delete this file?'
                  okText='Yes'
                  cancelText='No'
                  onConfirm={() => handleDelete(file.filename)}
                  okButtonProps={{
                    className: 'bg-blue-500',
                  }}
                >
                  <Tooltip title='Delete'>
                    <Button
                      icon={
                        <DeleteOutlined className='text-red-500 hover:text-red-600' />
                      }
                      className='flex justify-center items-center border-none'
                      size='small'
                    />
                  </Tooltip>
                </Popconfirm>
                {selectedFileName === file.filename && (
                  <Tooltip title='Update'>
                    <Button
                      icon={
                        <CheckOutlined className='text-red-500 hover:text-red-600' />
                      }
                      className='flex justify-center items-center border-none ml-1'
                      size='small'
                      onClick={() => handleReplace(file.filename)}
                    />
                  </Tooltip>
                )}
              </div>
            ))}
        </div>
      </div>
      <Table
        dataSource={tableData}
        columns={[...columns, { title: 'Actions', render: renderDeleteButton }]}
        rowKey={(record) => record.id}
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

export default ImportCloudTable;
