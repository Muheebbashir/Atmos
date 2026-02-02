import { useQuery } from "@tanstack/react-query";
import { fetchAllAlbums } from "../api/albumApi";

export const useAlbums = () => {
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAllAlbums,
  });

  return { albums: data, isLoading, error, isSuccess };
};
