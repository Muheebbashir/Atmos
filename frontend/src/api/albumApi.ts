import axios from "axios";

const SONG_API_URL = import.meta.env.VITE_SONG_API_URL || "http://localhost:8000";
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:7000";

export const fetchAllAlbums = async () => {
  const res = await axios.get(`${SONG_API_URL}/api/v1/album/all`);
  return res.data;
};


export const fetchAlbumById = async (albumId: string) => {
  const res = await axios.get(`${SONG_API_URL}/api/v1/album/${albumId}`);
  return res.data;
};

export const createAlbum = async (token: string, albumData: FormData) => {
  const res = await axios.post(
    `${ADMIN_API_URL}/api/v1/album/new`,
    albumData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const deleteAlbum = async (token: string, albumId: string) => {
  const res = await axios.delete(
    `${ADMIN_API_URL}/api/v1/album/${albumId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};