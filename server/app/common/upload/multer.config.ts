import { memoryStorage } from 'multer';
import { badRequestError } from '../errors/app.error';

export const multerConfig = {
  storage: memoryStorage(), // 메모리에 저장 후 Cloudinary로 전송
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(badRequestError('이미지 파일만 업로드 가능합니다.'), false);
      return;
    }
    callback(null, true);
  },
};