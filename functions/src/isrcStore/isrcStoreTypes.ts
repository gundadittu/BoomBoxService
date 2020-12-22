import { AppleMusicCatalogSong, validateAppleMusicCatalogSong } from '../appleMusic/appleMusicTypes';

export type IsrcStoreItemMediaType = "song" | "album";
export function validateIsrcStoreItemMediaType(arg: IsrcStoreItemMediaType | any): arg is IsrcStoreItemMediaType {
    if (arg == null || arg == undefined) {
        return false;
    }
    if (typeof arg != "string") { 
        return false; 
    }
    return arg == "song" || arg == "album";
}

export type IsrcStoreItem = {
    isrcId: string,
    mediaType: IsrcStoreItemMediaType,  
    appleMusicCatalogId: string,
    appleMusicCatalogSong: AppleMusicCatalogSong,
    // spotifyId: string, // TODO: 
    // spotifyTrack: SpotifyTrack // TODO: 
}
export function validateIsrcStoreItem(arg: IsrcStoreItem | any): arg is IsrcStoreItem {
    if (arg == null || arg == undefined) {
        return false;
    }
    const isrcIdValidate = typeof arg.isrcId == "string"; 
    const mediaTypeValidate = validateIsrcStoreItemMediaType(arg.mediaType); 
    const appleMusicCatalogIdValidate = typeof arg.appleMusicCatalogId == "string"; 
    const appleMusicCatalogSongValidate = validateAppleMusicCatalogSong(arg.appleMusicCatalogSong); 
    // const spotifyIdValidate = typeof arg.spotifyId == "string"; // TODO
    // const spotifyTrackValidate = //TODO: 
    return isrcIdValidate && mediaTypeValidate && appleMusicCatalogIdValidate && appleMusicCatalogSongValidate; 
}