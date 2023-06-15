import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { FileController } from '../controllers/FileController';
import fs from 'fs';
import File from '../models/File';

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: 'src/uploads/',
  filename: function (req, file, cb) {
    const filename = `${new Date().getTime() + file.originalname}`;
    cb(null, filename);
  },
});

const replacestorage = multer.diskStorage({
  destination: 'src/uploads/',
  filename: function (req, file, cb) {
    const filename = file.originalname.split('.')[0] + 'Edited' + '.xlsx';
    cb(null, filename);
  },
});
const upload = multer({ storage });

const replaceUpload = multer({ storage: replacestorage });

const fileController = new FileController();

router.post(
  '/upload',
  upload.single('file'),
  fileController.uploadFile.bind(fileController)
);

router.put(
  '/replace',
  replaceUpload.single('file'),
  async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { filename } = req.body;
      const file = await File.findOne({ where: { filename } });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      const filePath = path.join(__dirname, `../uploads/${file.filename}`);
      fs.unlinkSync(filePath);

      //@ts-ignore
      file.filename = req.file.filename;
      //@ts-ignore
      file.path = req.file.path;
      await file.save();

      res.status(200).json({ message: 'File replaced successfully', file });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error replacing file' });
    }
  }
);

router.get('/files', fileController.getFiles.bind(fileController));

router.delete('/files/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    //@ts-ignore
    const file = await File.findOne({ where: { filename } });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, `../uploads/${file.filename}`);
    fs.unlinkSync(filePath);

    await file.destroy();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default router;
