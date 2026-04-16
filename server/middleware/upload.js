import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

const uploadsDir = process.env.UPLOAD_DIR || 'uploads'

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuidv4()}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize }
})
