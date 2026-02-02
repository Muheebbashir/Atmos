import { useMutation,useQueryClient } from "@tanstack/react-query";
import {deleteSong} from "../api/songApi";
import { toast } from "react-hot-toast";

export const useDeleteSong = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ token, songId }: { token: string; songId: string }) =>
            deleteSong(token, songId),
        onSuccess: (data) => {
            toast.success(data.message || "Song deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["songs"] });
            queryClient.invalidateQueries({ queryKey: ["albumDetails"] });
            queryClient.invalidateQueries({ queryKey: ["userPlaylist"] });
            queryClient.invalidateQueries({ queryKey: ["playlistSongs"] });
        },
    });
    return { mutate, isPending, error };
}