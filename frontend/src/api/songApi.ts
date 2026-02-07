import axios from "axios";

const SONG_API_URL = import.meta.env.VITE_SONG_API_URL || "http://localhost:8000";
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:7000";

export const fetchAllSongs = async () => {
  const res = await axios.get(`${SONG_API_URL}/api/v1/song/all`);
  return res.data;
};

export const fetchSongById = async (id: string) => {
  const res = await axios.get(`${SONG_API_URL}/api/v1/song/${id}`);
  return res.data;
};

export const createSong = async (token: string, songData: FormData) => {
  const res = await axios.post(
    `${ADMIN_API_URL}/api/v1/song/new`,
    songData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const deleteSong = async (token: string, songId: string) => {
  const res = await axios.delete(
    `${ADMIN_API_URL}/api/v1/song/${songId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const uploadSongThumbnail = async (
  token: string,
  songId: string,
  thumbnailData: FormData
) => {
  const res = await axios.post(
    `${ADMIN_API_URL}/api/v1/song/${songId}`,
    thumbnailData,
    { 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};


