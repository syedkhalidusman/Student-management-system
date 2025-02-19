import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteFile = async (filename, type) => {
  if (!filename) return;

  let filePath;
  if (type === 'photo') {
    filePath = path.join(__dirname, '../../uploads/students/photos', filename);
  } else if (type === 'document') {
    filePath = path.join(__dirname, '../../uploads/students/documents', filename);
  }

  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Successfully deleted file: ${filename}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filename}:`, error);
  }
};

export const deleteStudentFiles = async (student) => {
  if (student.photo) {
    await deleteFile(student.photo, 'photo');
  }
  if (student.birthCertificate) {
    await deleteFile(student.birthCertificate, 'document');
  }
  if (student.bForm) {
    await deleteFile(student.bForm, 'document');
  }
};
