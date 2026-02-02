import { useMutation,useQueryClient } from "@tanstack/react-query";
import {createSong} from "../api/songApi";
import { toast } from "react-hot-toast";

export const useCreateSong = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ token, songData }: { token: string; songData: FormData }) =>
            createSong(token, songData),
        onSuccess: (data) => {
            toast.success(data.message || "Song created successfully");
            queryClient.invalidateQueries({ queryKey: ["songs"] });
            queryClient.invalidateQueries({ queryKey: ["albumDetails"] });
        },
    });
    return { mutate, isPending, error };
}