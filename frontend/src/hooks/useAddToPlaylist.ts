import {useMutation,useQueryClient} from "@tanstack/react-query";
import {addToPlaylist} from "../api/userApi";
import {toast} from "react-hot-toast";
import type { AddToPlaylistPayload } from "../types";

export const useAddToPlaylist = () => {
    const queryClient = useQueryClient();
    const {mutate,isPending,error} = useMutation({
        mutationFn:({songId,token}:AddToPlaylistPayload) => addToPlaylist(token,songId),
        onSuccess: (data) => {
            toast.success(data.message || "Song added to playlist");
            queryClient.invalidateQueries({queryKey: ['userPlaylist']});
            queryClient.invalidateQueries({queryKey: ['playlistSongs']});
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Failed to add song to playlist";
            toast.error(errorMessage);
        },
    });
    return {mutate,isPending,error};
}