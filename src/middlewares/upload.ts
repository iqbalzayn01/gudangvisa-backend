import multer from 'multer';
import path from 'path';

// Simpan file di dalam folder src/uploads sementara
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    // Format nama: tracking_number-timestamp-namafile
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      req.body.trackingNumber +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname),
    );
  },
});

// Validasi ektensi file (PDF, JPG, JPEG, PNG)
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Hanya PDF, JPG, JPEG, dan PNG.'));
  }
};

export const uploadDoc = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit maksimal 5MB
});
