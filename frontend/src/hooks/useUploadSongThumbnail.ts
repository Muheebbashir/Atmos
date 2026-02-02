import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadSongThumbnail } from "../api/songApi";
import { toast } from "react-hot-toast";

export const useUploadSongThumbnail = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ token, songId, thumbnail }: { token: string; songId: string; thumbnail: File }) => {
      const formData = new FormData();
      formData.append("thumbnail", thumbnail);
      return uploadSongThumbnail(token, songId, formData);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Song thumbnail uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      queryClient.invalidateQueries({ queryKey: ["albumDetails"] });
    },
  });
  return { mutate, isPending, error };
};