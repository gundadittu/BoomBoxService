import { AppleMusicCatalogSong, validateAppleMusicCatalogSong, DisabledAppleMusicCatalogSong } from '../appleMusic/appleMusicTypes';
import { Logger } from '../index';
export type IsrcStoreItemMediaType = "song" | "album";
export function validateIsrcStoreItemMediaType(arg: IsrcStoreItemMediaType | any): arg is IsrcStoreItemMediaType {
    Logger.info("validateIsrcStoreItemMediaType() outputs:", { arg: arg });

    if (arg == null || arg == undefined) {
        return false;
    }
    const typeValidate = typeof arg == "string";
    const possibleValueValidate = arg == "song" || arg == "album";
    Logger.info("validateIsrcStoreItemMediaType() outputs:", { typeValidate: typeValidate, possibleValueValidate: possibleValueValidate });
    return typeValidate && possibleValueValidate;
}

export type IsrcStoreItem = {
    isrcId: string,
    disabled: boolean,
    mediaType: IsrcStoreItemMediaType,
    appleMusicCatalogId: string,
    appleMusicCatalogSong: AppleMusicCatalogSong | DisabledAppleMusicCatalogSong,
    // spotifyId: string, // TODO: 
    // spotifyTrack: SpotifyTrack // TODO: 
}
export function validateIsrcStoreItem(arg: IsrcStoreItem | any): arg is IsrcStoreItem {
    Logger.info("validateIsrcStoreItem() inputs:", { arg: arg });
    if (arg == null || arg == undefined) {
        return false;
    }
    const isrcIdValidate = typeof arg.isrcId == "string";
    const mediaTypeValidate = validateIsrcStoreItemMediaType(arg.mediaType);
    const appleMusicCatalogIdValidate = typeof arg.appleMusicCatalogId == "string";
    const appleMusicCatalogSongValidate = validateAppleMusicCatalogSong(arg.appleMusicCatalogSong);
    const disabledValidate = typeof arg.disabled == "boolean";
    // const spotifyIdValidate = typeof arg.spotifyId == "string"; // TODO
    // const spotifyTrackValidate = //TODO: 
    Logger.info("validateIsrcStoreItem() outputs:", { disabledValidate: disabledValidate, isrcIdValidate: isrcIdValidate, mediaTypeValidate: mediaTypeValidate, appleMusicCatalogIdValidate: appleMusicCatalogIdValidate, appleMusicCatalogSongValidate: appleMusicCatalogSongValidate });
    return disabledValidate && isrcIdValidate && mediaTypeValidate && appleMusicCatalogIdValidate && appleMusicCatalogSongValidate;
}

// export type DisabledIsrcStoreItem = {
//     isrcId: string,
//     mediaType: IsrcStoreItemMediaType,  
//     appleMusicCatalogId: string,
//     disabledAppleMusicCatalogSong: DisabledAppleMusicCatalogSong,
//     // spotifyId: string, // TODO: 
//     // disabledSpotifyTrack: SpotifyTrack // TODO: 
// }