import {useMutation,useQueryClient} from "@tanstack/react-query";
import {addToPlaylist} from "../api/userApi";
import {toast} from "react-hot-toast";

interface AddToPlaylistPayload {
  songId: string;
  token: string;
}

export const useAddToPlaylist = () => {
    const queryClient = useQueryClient();
    const {mutate,isPending,error} = useMutation({
        mutationFn:({songId,token}:AddToPlaylistPayload) => addToPlaylist(token,songId),
        onSuccess: (data) => {
            toast.success(data.message || "Song added to playlist");
            queryClient.invalidateQueries({queryKey: ['userPlaylist']});
            queryClient.invalidateQueries({queryKey: ['playlistSongs']});
        },
    });
    return {mutate,isPending,error};
}