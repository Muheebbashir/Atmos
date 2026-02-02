import axios from "axios";

export const fetchAllSongs = async () => {
  const res = await axios.get("http://localhost:8000/api/v1/song/all");
  return res.data;
};

export const fetchSongById = async (id: string) => {
  const res = await axios.get(`http://localhost:8000/api/v1/song/${id}`);
  return res.data;
};


