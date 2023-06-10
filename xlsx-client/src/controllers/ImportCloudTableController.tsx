import * as XLSX from 'xlsx';
import TableData from '../models/TableData';

class ImportCloudTableController {
  public static async handleFileUpload(filename: string): Promise<TableData[]> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3000/uploads/${filename}`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          const data = new Uint8Array(arrayBuffer);
          console.log('Data: ', data);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: TableData[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          }) as TableData[];

          if (jsonData.length && Array.isArray(jsonData[0])) {
            jsonData.shift();
          }

          resolve(jsonData);
        })
        .catch((error) => {
          reject(new Error('Failed to fetch the file.'));
        });
    });
  }
}

export default ImportCloudTableController;
