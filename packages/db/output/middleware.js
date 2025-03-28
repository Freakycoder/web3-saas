"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFile = exports.ALLOWED_MIME_TYPES = exports.upload = exports.userMiddleware = exports.secreatKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.secreatKey = 'SeCrEaT';
const multer_1 = __importDefault(require("multer"));
const userMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    const data = jsonwebtoken_1.default.verify(token, exports.secreatKey);
    if (!data) {
        res.status(400).json({ message: "no wallet address found" });
        return;
    }
    // @ts-ignore
    if (data.userID) {
        //@ts-ignore
        req.userID = data.userID;
        next();
    }
    else {
        res.status(403).json({ message: "please connect wallet" });
        return;
    }
};
exports.userMiddleware = userMiddleware;
// Define allowed image types
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
];
exports.ALLOWED_MIME_TYPES = ALLOWED_MIME_TYPES;
// Type-safe file filter function
const imageFileFilter = (req, file, cb) => {
    // Check if file mimetype is in allowed types
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        // Accept the file
        cb(null, true);
    }
    else {
        // Reject the file with an error
        cb(new Error('Invalid file type. Only images are allowed.'));
    }
};
// Multer configuration with TypeScript typing
const upload = (0, multer_1.default)({
    // Limit file size to 5MB
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    // Use the type-safe file filter
    fileFilter: imageFileFilter,
    // Optional: storage configuration
    storage: multer_1.default.memoryStorage() // Keeps file in memory as buffer
});
exports.upload = upload;
// Utility function for file size validation
const validateFileSize = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    return file.size <= MAX_FILE_SIZE;
};
// Comprehensive file validation function
const validateFile = (file) => {
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
exports.validateFile = validateFile;
