import axios from 'axios';
import * as XLSX from 'xlsx';
import { message } from 'antd';

class ConvertToXlsxController {
  static exportToXLSX = (tableData, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const xlsxBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([xlsxBuffer], { type: 'application/octet-stream' });

    const formData = new FormData();
    formData.append('file', blob, filename);
    formData.append('filename', filename);

    axios
      .put('http://localhost:3000/replace', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        message.success('File updated successfully');
      })
      .catch((error) => {
        message.error(error.response.message);
      });
  };
}

export default ConvertToXlsxController;
