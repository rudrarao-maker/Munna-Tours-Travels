import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${req.user?.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    // Update user profile in DB
    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: { avatar: avatarUrl }
    });

    res.status(200).json({ 
      message: 'Avatar uploaded successfully', 
      avatar: avatarUrl 
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @route   POST /api/upload/gallery
// @desc    Upload multiple images for packages/hotels
// @access  Private/Admin
// We can use this later for Tour Packages
router.post('/gallery', protect, upload.array('images', 5), async (req, res): Promise<void> => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ message: 'No files uploaded' });
      return;
    }

    const fileUrls = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);

    res.status(200).json({ 
      message: 'Images uploaded successfully', 
      urls: fileUrls 
    });
  } catch (error: any) {
    console.error('Gallery Upload Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

export default router;
