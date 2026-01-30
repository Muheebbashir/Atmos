import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import getBuffer from "../lib/dataUri.js";
import sql from "../lib/db.js";
import cloudinary from "cloudinary";
import {redisClient} from '../index.js'; 

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
    if(redisClient.isReady){
         await redisClient.del("albums");
         console.log("Albums cache cleared");
    }

    res.status(201).json({ message: "Album added successfully", album: result[0] });
});

export const addSong=asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Implementation for adding a song
    if(req.user?.role !== 'admin'){
        res.status(403).json({ message: "Forbidden" });
        return;
   }
    const {title,description,album_id} = req.body;
    const isAlbumExist=await sql`
        SELECT * FROM albums WHERE id=${album_id}
    `;
    if(isAlbumExist.length===0){
        res.status(400).json({ message: "Album does not exist" });
        return;
    }
    const file= req.file;
    if(!file){
        res.status(400).json({ message: "Audio file is required" });
        return;
    }
    const buffer = getBuffer(file);

    if(!buffer){
        res.status(500).json({ message: "Error processing file" });
        return;
    }
    const uploadResult = await cloudinary.v2.uploader.upload(buffer, {
        folder:"songs",
        resource_type: "video",
    });
    const result=await sql`
        INSERT INTO songs (title, description, audio, album_id)
        VALUES (${title}, ${description}, ${uploadResult.secure_url}, ${album_id})
        RETURNING *
    `;
    if(redisClient.isReady){
         await redisClient.del("songs");
         console.log("Songs cache cleared");
    }
    res.status(201).json({ message: "Song added successfully", song: result[0] });
});

export const addThumbnail=asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Implementation for adding a thumbnail to an existing album or song
    if(req.user?.role !== 'admin'){
        res.status(403).json({ message: "Forbidden" });
        return;
   }
   const song=await sql`SELECT * FROM songs WHERE id=${req.params.id}`;
    if(song.length===0){
        res.status(400).json({ message: "Song does not exist" });
        return;
    }
    const file= req.file;
    if(!file){
        res.status(400).json({ message: "Thumbnail file is required" });
        return;
    }
    const buffer = getBuffer(file);

    if(!buffer){
        res.status(500).json({ message: "Error processing file" });
        return;
    }
    const uploadResult = await cloudinary.v2.uploader.upload(buffer)
    const result=await sql`
        UPDATE songs
        SET thumnail=${uploadResult.secure_url}
        WHERE id=${req.params.id}
        RETURNING *
    `;
    if(redisClient.isReady){
         await redisClient.del("songs");
         console.log("Songs cache cleared");
    }
    res.status(200).json({ message: "Thumbnail added successfully", song: result[0] });
});

export const deleteAlbum=asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Implementation for deleting an album
    if(req.user?.role !== 'admin'){
        res.status(403).json({ message: "Forbidden" });
        return;
   }
   const {id} = req.params;
   const album=await sql`SELECT * FROM albums WHERE id=${id}`;
    if(album.length===0){
        res.status(400).json({ message: "Album does not exist" });
        return;
    }
   await sql`DELETE FROM songs WHERE album_id=${id}`;
   await sql`
        DELETE FROM albums WHERE id=${id}
   `;
   if(redisClient.isReady){
        await redisClient.del("albums");
        console.log("Albums cache cleared");
    }
    if(redisClient.isReady){
         await redisClient.del("songs");
         console.log("Songs cache cleared");
    }
    res.status(200).json({ message: "Album deleted successfully" });
   
});

export const deleteSong=asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Implementation for deleting a song
    if(req.user?.role !== 'admin'){
        res.status(403).json({ message: "Forbidden" });
        return;
   }
    const {id} = req.params;
    const song=await sql`SELECT * FROM songs WHERE id=${id}`;
    if(song.length===0){
        res.status(400).json({ message: "Song does not exist" });
        return;
    }
    await sql`DELETE FROM songs WHERE id=${id}`;

    if(redisClient.isReady){
         await redisClient.del("songs");
         console.log("Songs cache cleared");
    }
    res.status(200).json({ message: "Song deleted successfully" });
});