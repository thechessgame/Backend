import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

export const uploadUserImage = multer({ storage, fileFilter }).single('image');
export const deleteUserImage = (filePath) => {
    filePath = path.join(fs.realpathSync('.'), '.', filePath);
    fs.unlink(filePath, err => { return err });
};