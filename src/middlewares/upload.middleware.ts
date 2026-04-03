import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../utils/AppError';

// 1. Pastikan folder uploads tersedia, jika tidak, buat otomatis
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Konfigurasi penyimpanan disk (DiskStorage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Simpan di public/uploads
  },
  filename: (req, file, cb) => {
    // Format nama file: timestamp-namafileasli.ext agar tidak ada nama yang duplikat
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// 3. Filter jenis file (Hanya izinkan gambar dan PDF)
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // File diizinkan
  } else {
    // Gunakan AppError jika file tidak sesuai
    cb(
      new AppError(
        400,
        'Format file tidak valid. Hanya menerima JPG, PNG, dan PDF.',
      ) as any,
      false,
    );
  }
};

// 4. Inisialisasi middleware upload
export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal ukuran file 5 Megabyte
  },
});
