import crypto from "crypto";

export default function GeneratePlaylistString(Length : number): string {
    const FinalLength = Math.ceil(Length / 2);
    const PlaylistString = crypto.randomBytes(FinalLength).toString('hex');
    return PlaylistString;
}



  