import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import getBuffer from "../lib/dataUri.js";
import sql from "../lib/db.js";
import cloudinary from "cloudinary";

interface AuthenticatedRequest extends Request {
    user?:{
        id:string,
        role:string
    }
}

export const addAlbum=asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Implementation for adding an album
   if(req.user?.role !== 'admin'){
        res.status(403).json({ message: "Forbidden" });
        return;
   }

   const {title,description} = req.body;


   const file = req.file;
   if(!file){
       res.status(400).json({ message: "Thumnail file is required" });
       return;
   }

    const buffer = getBuffer(file);

    if(!buffer){
        res.status(500).json({ message: "Error processing file" });
        return;
    }

    const uploadResult = await cloudinary.v2.uploader.upload(buffer, {
        folder:"albums",
    });

    const result=await sql`
        INSERT INTO albums (title, description, thumnail)
        VALUES (${title}, ${description}, ${uploadResult.secure_url})
        RETURNING *
    `;

    res.status(201).json({ message: "Album added successfully", album: result[0] });
});