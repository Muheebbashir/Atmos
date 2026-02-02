import axios from "axios";

export const fetchAllAlbums = async () => {
  const res = await axios.get("http://localhost:8000/api/v1/album/all");
  return res.data;
};


export const fetchAlbumById = async (albumId: string) => {
  const res = await axios.get(`http://localhost:8000/api/v1/album/${albumId}`);
  return res.data;
};

export const createAlbum = async (token: string, albumData: FormData) => {
  const res = await axios.post(
    "http://localhost:7000/api/v1/album/new",
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
    `http://localhost:7000/api/v1/album/${albumId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};