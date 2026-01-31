import axios from "axios";

export const fetchAllAlbums = async () => {
  const res = await axios.get("http://localhost:8000/api/v1/album/all");
  return res.data;
};
