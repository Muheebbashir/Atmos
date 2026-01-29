import DataURIParser from "datauri/parser.js";
import path from "path";

const getBuffer=(file:any)=>{
    const parser = new DataURIParser();

    const extName = path.extname(file.originalname).toString();
    const dataUri = parser.format(extName, file.buffer);
    return dataUri.content;
}

export default getBuffer;