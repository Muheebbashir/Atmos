import sql from "../lib/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import {redisClient} from '../index.js';

export const getAllAlbums = asyncHandler(async (req, res) => {
    let albums;
    // Logic to fetch all albums from the database
    const CACHE_EXPIRY = 1800; 
    if(redisClient.isReady){
        albums=await redisClient.get("albums");
    }
    if(albums){
        console.log("Fetching albums from cache");
        return res.status(200).json( JSON.parse(albums) );
    }
    else{
    albums=await sql `SELECT * FROM albums`;
    // Convert ispremium to isPremium for camelCase consistency
    const albumsWithCamelCase = albums.map(album => ({
        ...album,
        isPremium: album.ispremium
    }));
    if(redisClient.isReady){
        console.log("Storing albums in cache");
        await redisClient.setEx("albums",CACHE_EXPIRY,JSON.stringify(albumsWithCamelCase));
    }
    res.status(200).json( albumsWithCamelCase );
    }
});

export const getAllSongs = asyncHandler(async (req, res) => {
    let songs;
    // Logic to fetch all songs from the database
    const CACHE_EXPIRY = 1800; 
    if(redisClient.isReady){
        songs=await redisClient.get("songs");
    }
    if(songs){
        console.log("Fetching songs from cache");
        return res.status(200).json( JSON.parse(songs) );
    }
    else{
    songs=await sql `SELECT * FROM songs`;
    // Convert ispremium to isPremium for camelCase consistency
    const songsWithCamelCase = songs.map(song => ({
        ...song,
        isPremium: song.ispremium
    }));
    if(redisClient.isReady){
        console.log("Storing songs in cache");
        await redisClient.setEx("songs",CACHE_EXPIRY,JSON.stringify(songsWithCamelCase));
    }
    res.status(200).json( songsWithCamelCase );
    }
});

export const getAllSongsOfAlbum = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let album, songs;
    const CACHE_EXPIRY = 1800;
    // Logic to fetch album and its songs from the database
    if(redisClient.isReady){
        const cachedData=await redisClient.get(`album_${id}`);
        if(cachedData){
            console.log("Fetching album and songs from cache");
            return res.status(200).json( JSON.parse(cachedData) );
        }
    }

    album=await sql `SELECT * FROM albums WHERE id=${id}`;
    if(album.length===0){
        return res.status(404).json( { message: "Album not found" } );
    }
    songs=await sql `SELECT * FROM songs WHERE album_id=${id}`;
    // Convert ispremium to isPremium for camelCase consistency
    const albumWithCamelCase = { ...album[0], isPremium: album[0]?.ispremium ?? false };
    const songsWithCamelCase = songs.map(song => ({ ...song, isPremium: song?.ispremium ?? false }));
    const response = { album: albumWithCamelCase, songs: songsWithCamelCase };
    if(redisClient.isReady){
        console.log("Storing album and songs in cache");
        await redisClient.setEx(`album_${id}`,CACHE_EXPIRY,JSON.stringify(response));
    }
    res.status(200).json( response ); 
    
});

export const getSingleSong = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const song = await sql `SELECT * FROM songs WHERE id=${id}`;
    if(song.length===0){
        return res.status(404).json( { message: "Song not found" } );
    }
    // Convert ispremium to isPremium for camelCase consistency
    const songWithCamelCase = { ...song[0], isPremium: song[0]?.ispremium ?? false };
    res.status(200).json( songWithCamelCase );
});