import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        if (file.fieldname === 'photo') {
            uploadPath = path.join(__dirname, '../../uploads/students/photos');
        } else if (file.fieldname === 'birthCertificate' || file.fieldname === 'bForm') {
            uploadPath = path.join(__dirname, '../../uploads/students/documents');
        }
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Get student name from the request body
        const studentName = req.body.name ? req.body.name.replace(/\s+/g, '_') : 'Unknown';
        
        // Determine file type category
        let fileType;
        switch (file.fieldname) {
            case 'photo':
                fileType = 'photo';
                break;
            case 'birthCertificate':
                fileType = 'birth';
                break;
            case 'bForm':
                fileType = 'bform';
                break;
            default:
                fileType = 'doc';
        }
        
        // Generate random number
        const randomNumber = Math.floor(Math.random() * 10000);
        
        // Create filename with original extension
        const fileExtension = path.extname(file.originalname);
        const newFilename = `${studentName}_${fileType}_${randomNumber}${fileExtension}`;
        
        cb(null, newFilename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'photo') {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed for photos!'), false);
        }
    } else if (file.fieldname === 'birthCertificate' || file.fieldname === 'bForm') {
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
            return cb(new Error('Only PDF and image files are allowed for documents!'), false);
        }
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;
