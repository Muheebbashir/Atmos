import { useMutation,useQueryClient } from "@tanstack/react-query";
import { createAlbum } from "../api/albumApi";
import { toast } from "react-hot-toast";

export const useCreateAlbum = (token: string | null) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (albumData: FormData) => {
            if (!token) {
                throw new Error("No token provided");
            }
            const result = await createAlbum(token, albumData);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Album created successfully");
            queryClient.invalidateQueries({queryKey: ['allAlbums']});

        },
        onError: (error) => {
            toast.error(error.message || "Failed to create album");
        },
    });
    return mutation;
}