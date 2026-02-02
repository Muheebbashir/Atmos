export interface AddToPlaylistPayload {
  songId: string;
  token: string;
}

export interface PlaylistResponse {
  message: string;
  playlist: string[];
}
