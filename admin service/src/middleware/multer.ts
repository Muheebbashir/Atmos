import multer from "multer";

const storage = multer.memoryStorage();

export const uploadSingle = (field: string) => multer({ storage }).single(field);