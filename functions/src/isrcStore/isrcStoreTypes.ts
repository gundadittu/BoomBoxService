import { AppleMusicCatalogSong, validateAppleMusicCatalogSong } from '../appleMusic/appleMusicTypes';
import { SpotifyTrack, validateSpotifyTrack } from '../spotify/spotifyTypes';
import { LogManager } from '../index';
export type IsrcStoreItemMediaType = "song" | "album";
export function validateIsrcStoreItemMediaType(arg: IsrcStoreItemMediaType | any): arg is IsrcStoreItemMediaType {
    LogManager.info("validateIsrcStoreItemMediaType() outputs:", { arg: arg });

    if (arg == null || arg == undefined) {
        return false;
    }
    const typeValidate = typeof arg == "string";
    const possibleValueValidate = arg == "song" || arg == "album";
    LogManager.info("validateIsrcStoreItemMediaType() outputs:", { typeValidate: typeValidate, possibleValueValidate: possibleValueValidate });
    return typeValidate && possibleValueValidate;
}

export type IsrcStoreItem = {
    isrcId: string,
    playEnabledForAppleMusic: boolean,
    playEnabledForSpotify: boolean,
    mediaType: IsrcStoreItemMediaType,
    availableInAppleMusicCatalog?: boolean,
    appleMusicCatalogId?: string,
    appleMusicCatalogSong?: AppleMusicCatalogSong,
    availableInSpotifyCatalog?: boolean,
    spotifyId?: string,
    spotifyTrack?: SpotifyTrack
}
export function validateIsrcStoreItem(arg: IsrcStoreItem | any): arg is IsrcStoreItem {
    // LogManager.info("validateIsrcStoreItem() inputs:", { arg: arg });
    if (!arg) {
        return false;
    }
    const isrcIdValidate = typeof arg.isrcId == "string";
    const mediaTypeValidate = validateIsrcStoreItemMediaType(arg.mediaType);
    const playEnabledForAppleMusicValidate = typeof arg.playEnabledForAppleMusic == "boolean";
    const playEnabledForSpotifyValidate = typeof arg.playEnabledForSpotify == "boolean";

    const availableOnAppleMusicValidate = arg.availableInAppleMusicCatalog ? typeof arg.availableInAppleMusicCatalog === "boolean" : true;
    const appleMusicCatalogIdValidate = arg.appleMusicCatalogId ? typeof arg.appleMusicCatalogId == "string" : true;
    const appleMusicCatalogSongValidate = arg.appleMusicCatalogSong ? validateAppleMusicCatalogSong(arg.appleMusicCatalogSong) : true;

    const availableOnSpotifyValidate = arg.availableInSpotifyCatalog ? typeof arg.availableInSpotifyCatalog === "boolean" : true;
    const spotifyIdValidate = arg.spotifyId ? typeof arg.spotifyId == "string" : true;
    const spotifyTrackValidate = arg.spotifyTrack ? validateSpotifyTrack(arg.spotifyTrack) : true;

    const validationStatus = playEnabledForAppleMusicValidate && playEnabledForSpotifyValidate
        && isrcIdValidate && mediaTypeValidate
        && availableOnAppleMusicValidate && appleMusicCatalogIdValidate
        && appleMusicCatalogSongValidate && availableOnSpotifyValidate
        && spotifyIdValidate && spotifyTrackValidate;

    if (!validationStatus) {
        LogManager.info("validateIsrcStoreItem() outputs:", {
            availableOnAppleMusicValidate: availableOnAppleMusicValidate, availableOnSpotifyValidate: availableOnSpotifyValidate,
            spotifyIdValidate: spotifyIdValidate, spotifyTrackValidate: spotifyTrackValidate, playEnabledForSpotifyValidate: playEnabledForSpotifyValidate,
            playEnabledForAppleMusicValidate: playEnabledForAppleMusicValidate, isrcIdValidate: isrcIdValidate, mediaTypeValidate: mediaTypeValidate,
            appleMusicCatalogIdValidate: appleMusicCatalogIdValidate, appleMusicCatalogSongValidate: appleMusicCatalogSongValidate,
        });
    }
    return validationStatus;
}

// export type DisabledIsrcStoreItem = {
//     isrcId: string,
//     mediaType: IsrcStoreItemMediaType,  
//     appleMusicCatalogId: string,
//     disabledAppleMusicCatalogSong: DisabledAppleMusicCatalogSong,
//     // spotifyId: string, // TODO: 
//     // disabledSpotifyTrack: SpotifyTrack // TODO: 
// }