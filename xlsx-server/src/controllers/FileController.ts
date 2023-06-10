import { Request, Response } from 'express';
import File from '../models/File';

export class FileController {
  public async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      //@ts-ignore
      const { filename, path } = req.file;
      //@ts-ignore
      const file = await File.create({ filename, path });

      res.status(200).json({ message: 'File uploaded successfully', file });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  }

  public async getFiles(req: Request, res: Response): Promise<void> {
    try {
      //@ts-ignore
      const files = await File.findAll();

      res.status(200).json({ files });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching files' });
    }
  }
}
