import express from 'express';
import multer from 'multer';
import { processUpload } from '../controllers/uploadController.js'; // Путь до контроллера

export const router = express.Router();
// Настройка multer для сохранения загруженных файлов
const upload = multer({ dest: 'public/uploads/' });

router.get('/', (req, res) => {
  res.send('Upload page');
});

// Маршрут для загрузки данных
router.post('/', upload.single('datafile'), processUpload);
