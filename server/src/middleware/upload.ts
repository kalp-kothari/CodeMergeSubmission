import multer from 'multer';
import { getAllowedMimeTypes } from '../utils/fileValidation';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (getAllowedMimeTypes().includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('LIMIT_UNEXPECTED_FILE'));
    }
  }
}).single('file');
