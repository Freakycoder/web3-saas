import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
export const secreatKey = 'SeCrEaT'
import multer, { FileFilterCallback } from "multer"

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']!;
    const token = authHeader?.split(' ')[1];
    const data = jwt.verify(token, secreatKey);

    if (!data) {
        res.status(400).json({ message: "no wallet address found" });
        return
    }
    // @ts-ignore
    if (data.userID) {
        //@ts-ignore
        req.userID = data.userID;
        next();
    }
    else {
        res.status(403).json({ message: "please connect wallet" })
        return
    }
}

// Define allowed image types
const ALLOWED_MIME_TYPES: string[] = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp'
  ];
  
  // Type-safe file filter function
  const imageFileFilter = (
    req: Request, 
    file: Express.Multer.File, 
    cb: FileFilterCallback
  ) => {
    // Check if file mimetype is in allowed types
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      // Accept the file
      cb(null, true);
    } else {
      // Reject the file with an error
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  };
  
  // Multer configuration with TypeScript typing
  const upload = multer({
    // Limit file size to 5MB
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    },
    
    // Use the type-safe file filter
    fileFilter: imageFileFilter,
  
    // Optional: storage configuration
    storage: multer.memoryStorage() // Keeps file in memory as buffer
  });
  
  // Utility function for file size validation
  const validateFileSize = (file: Express.Multer.File): boolean => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    return file.size <= MAX_FILE_SIZE;
  };
  
  // Comprehensive file validation function
  const validateFile = (file: Express.Multer.File): { valid: boolean; error?: string } => {
    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      };
    }
  
    // Check file size
    if (!validateFileSize(file)) {
      return { 
        valid: false, 
        error: 'File is too large. Maximum size is 5MB.' 
      };
    }
  
    return { valid: true };
  };
  
  export { 
    upload, 
    ALLOWED_MIME_TYPES, 
    validateFile 
  };