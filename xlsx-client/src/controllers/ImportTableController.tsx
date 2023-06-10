import { RcFile } from 'antd/lib/upload/interface';
import * as XLSX from 'xlsx';
import TableData from '../models/TableData';

class ImportTableController {
  public static async handleFileUpload(file: RcFile): Promise<TableData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: TableData[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as TableData[];

        if (jsonData.length && Array.isArray(jsonData[0])) {
          jsonData.shift();
        }

        resolve(jsonData);
      };

      reader.onerror = (e) => {
        reject(new Error('Failed to read the file.'));
      };

      reader.readAsArrayBuffer(file);
    });
  }
}

export default ImportTableController;
