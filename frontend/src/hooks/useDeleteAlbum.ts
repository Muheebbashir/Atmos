import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAlbum } from "../api/albumApi";
import { toast } from "react-hot-toast";

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ token, albumId }: { token: string; albumId: string }) =>
      deleteAlbum(token, albumId),
    onSuccess: (data) => {
      toast.success(data.message || "Album deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      queryClient.invalidateQueries({ queryKey: ["albumDetails"] });
    },
  });
  return { mutate, isPending, error };
};