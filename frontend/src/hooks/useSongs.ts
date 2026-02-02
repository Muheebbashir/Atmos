import { useQuery } from "@tanstack/react-query";
import { fetchAllSongs } from "../api/songApi";

export const useSongs = () => {
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchAllSongs,
  });

  return { songs: data, isLoading, error, isSuccess };
};
