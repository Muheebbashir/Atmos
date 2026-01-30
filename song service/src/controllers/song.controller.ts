import sql from "../lib/db.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllAlbums = asyncHandler(async (req, res) => {
    let albums;
    // Logic to fetch all albums from the database
    albums=await sql `SELECT * FROM albums`;
    res.status(200).json( albums );
});

export const getAllSongs = asyncHandler(async (req, res) => {
    let songs;
    // Logic to fetch all songs from the database
    songs=await sql `SELECT * FROM songs`;
    res.status(200).json( songs );
});

export const getAllSongsOfAlbum = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let album, songs;
    // Logic to fetch album and its songs from the database
    album=await sql `SELECT * FROM albums WHERE id=${id}`;
    if(album.length===0){
        return res.status(404).json( { message: "Album not found" } );
    }
    songs=await sql `SELECT * FROM songs WHERE album_id=${id}`;
    const response = { album: album[0], songs };
    res.status(200).json( response ); 
    
});

export const getSingleSong = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const song = await sql `SELECT * FROM songs WHERE id=${id}`;
    if(song.length===0){
        return res.status(404).json( { message: "Song not found" } );
    }
    res.status(200).json( song[0] );
});