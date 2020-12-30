import { LogManager } from '../index';

export type AppleMusicCatalogSongPreview = {
    url: string
}
export function validateAppleMusicCatalogSongPreview(arg: AppleMusicCatalogSongPreview | any): arg is AppleMusicCatalogSongPreview {
    if (!arg) {
        LogManager.info("validateAppleMusicCatalogSongPreview failed because provided arg was null/undefined:", arg)
        return false;
    }
    const urlValidate = typeof arg.url === "string";
    return urlValidate;
}

// https://developer.apple.com/documentation/applemusicapi/song/attributes
export type AppleMusicCatalogSongAttributes = {
    artistName: string;
    // --> Will not be null 
    isrc: string,
    // --> Will not be null
    albumName: string,
    // --> Will not be null 
    genreNames: Array<string>,
    // --> Will not be null 
    discNumber: number,
    // --> Will not be null
    name: string,
    // --> Will not be null
    artwork: AppleMusicArtwork
    // --> Will not be null
    previews: Array<AppleMusicCatalogSongPreview>,
    // --> Will not be null
    releaseDate: string,
    // --> Will not be null
    trackNumber: number,
    // --> Will not be null
    url: string,
    // --> Will not be null
    durationInMillis?: number,
    // --> CAN be null
    playParams?: AppleMusicPlayParams,
    // --> CAN be null
    composerName?: string,
    contentRating?: string,
    hasLyrics?: boolean,
}
export function validateAppleMusicCatalogSongAttributes(arg: AppleMusicCatalogSongAttributes | any): arg is AppleMusicCatalogSongAttributes {
    // LogManager.info("validateAppleMusicCatalogSongAttributes() input:", { arg: arg });
    if (!arg) {
        LogManager.info("validateAppleMusicCatalogSongAttributes failed because provided arg was null/undefined:", arg)
        return false;
    }
    const artistNameValidate = typeof arg.artistName === "string";
    const genreNamesValidate = Array.isArray(arg.genreNames);
    const isrcValidate = typeof arg.isrc === "string";
    const previewsValidate = validateAppleMusicCatalogSongPreview(arg.previews);
    const releaseDateValidate = typeof arg.releaseDate === "string";
    const urlValidate = typeof arg.url === "string";
    const artworkValidate = validateAppleMusicArtwork(arg.artwork);
    const trackNumberValidate = typeof arg.trackNumber === "string";
    const nameValidate = typeof arg.name === "string";
    const discNumberValidate = typeof arg.discNumber === "number";
    const albumNameValidate = typeof arg.albumName === "string";

    // Optional properties validation:
    const contentRatingValidate = arg.contentRating ? typeof arg.contentRating === "string" : true;
    const durationInMillisValidate = arg.durationInMillis ? typeof arg.durationInMillis === "number" : true;
    const composerNameValidate = arg.composerName ? typeof arg.composerName === "string" : true;
    const playParamsValidate = arg.playParams ? validateAppleMusicPlayParams(arg.playParams) : true;
    const hasLyricsValidate = arg.hasLyrics ? typeof arg.hasLyrics === "boolean" : true;

    const validationStatus = artworkValidate && durationInMillisValidate && artistNameValidate
        && genreNamesValidate && isrcValidate && nameValidate
        && releaseDateValidate && playParamsValidate && contentRatingValidate
        && composerNameValidate && hasLyricsValidate && discNumberValidate
        && trackNumberValidate && urlValidate && previewsValidate && albumNameValidate;

    if (!validationStatus) {
        LogManager.info("validateAppleMusicCatalogSongAttributes() failed validation:", {
            arg: arg,
            contentRatingValidate: contentRatingValidate, durationInMillisValidate: durationInMillisValidate,
            artistNameValidate: artistNameValidate, genreNamesValidate: genreNamesValidate,
            isrcValidate: isrcValidate, nameValidate: nameValidate,
            playParamsValidate: playParamsValidate,
            releaseDateValidate: releaseDateValidate,
            artworkValidate: artworkValidate,
            previewsValidate: previewsValidate,
            urlValidate: urlValidate,
            trackNumberValidate: trackNumberValidate,
            discNumberValidate: discNumberValidate,
            composerNameValidate: composerNameValidate,
            hasLyricsValidate: hasLyricsValidate,
            albumNameValidate: albumNameValidate,
        });
    }

    return validationStatus;
}

// https://developer.apple.com/documentation/applemusicapi/song
// look at "response" section: https://developer.apple.com/documentation/applemusicapi/get_multiple_catalog_songs_by_id
export type AppleMusicCatalogSong = {
    attributes: AppleMusicCatalogSongAttributes,
    href: string,
    id: string,
    // relationships: // TODO: add sub types + validator checks below
    // --> https://developer.apple.com/documentation/applemusicapi/song/relationships
    type: "song"
}
export function validateAppleMusicCatalogSong(arg: AppleMusicCatalogSong | any): arg is AppleMusicCatalogSong {
    // LogManager.info("validateAppleMusicCatalogSong() input:", { arg: arg });
    if (!arg) {
        LogManager.info("validateAppleMusicCatalogSong failed because provided arg was null/undefined:", arg)
        return false;
    }
    const attributesValidate = validateAppleMusicCatalogSongAttributes(arg.attributes);
    const idValidate = typeof arg.id === "string";
    const typeValidate = arg.type === "song";
    const hrefValidate = typeof arg.href === "string";

    const validationStatus = attributesValidate && idValidate && typeValidate && hrefValidate;

    if (!validationStatus) {
        LogManager.info("validateAppleMusicCatalogSong() outputs:", {
            arg: arg,
            attributesValidate: attributesValidate, idValidate: idValidate,
            typeValidate: typeValidate, hrefValidate: hrefValidate,
        });
    }
    return validationStatus;
}

// https://developer.apple.com/documentation/applemusicapi/playparameters
export type AppleMusicPlayParams = {
    id: string,
    // --> Will not be null
    kind: string,
    // --> Will not be null
    isLibrary?: boolean,
    reporting?: boolean,
    catalogId?: string
}
export function validateAppleMusicPlayParams(arg: AppleMusicPlayParams | any): arg is AppleMusicPlayParams {
    // LogManager.info("validateAppleMusicAppleMusicPlayParams() inputs:", { arg: arg });
    if (!arg) {
        LogManager.info("validateAppleMusicAppleMusicPlayParams() recieved arg that was null/undefined:", { arg: arg })
        return false;
    }
    const idValidate = typeof arg.id === "string";
    const kindValidate = typeof arg.kind === "string";

    // Validating optional properties 
    const isLibraryValidate = arg.isLibrary ? typeof arg.isLibrary === "boolean" : true;
    const catalogIDValidate = arg.catalogId ? typeof arg.catalogId === "string" : true;
    const reportingValidate = arg.reporting ? typeof arg.reporting === "boolean" : true;

    const validationStatus = idValidate && kindValidate && isLibraryValidate
        && catalogIDValidate && reportingValidate;

    if (!validationStatus) {
        LogManager.info("validateAppleMusicAppleMusicPlayParams() failed validation:", {
            arg: arg,
            idValidate: idValidate, kindValidate: kindValidate,
            isLibraryValidate: isLibraryValidate, catalogIDValidate: catalogIDValidate,
            reportingValidate: reportingValidate,
        });
    }

    return validationStatus;
}

// https://developer.apple.com/documentation/applemusicapi/artwork
export type AppleMusicArtwork = {
    width: number,
    // --> Will not be null
    height: number,
    // --> Will not be null
    url: string,
    // --> Will not be null
    bgColor?: string,
    // textColor1
    // textColor2
    // textColor3 
    // textColor4
}
export function validateAppleMusicArtwork(arg: AppleMusicArtwork | any): arg is AppleMusicArtwork {
    // LogManager.info("validateAppleMusicArtwork() inputs:", { arg: arg });

    if (!arg) {
        LogManager.info("validateAppleMusicArtwork failed because provided arg was null/undefined:", arg)
        return false;
    }
    const urlValidate = typeof arg.url === "string";
    const widthValidate = typeof arg.width === "string";
    const heightValidate = typeof arg.height === "string";

    // Validation optional parameters 
    const bgColorValidate = arg.bgColor ? typeof arg.bgColor === "string" : true;

    const validationStatus = urlValidate && widthValidate
        && heightValidate && bgColorValidate;
    if (!validationStatus) {
        LogManager.info("validateAppleMusicArtwork() failed validation:", {
            arg: arg,
            urlValidate: urlValidate, widthValidate: widthValidate,
            heightValidate: heightValidate, bgColorValidate: bgColorValidate,
        });
    }
    return validationStatus
}

// https://developer.apple.com/documentation/applemusicapi/playparameters
export type AppleMusicLibrarySongPlayParams = {
    id: string,
    // --> Will not be null
    kind: string,
    // --> Will not be null
    catalogId: string
    // --> Can be null according to api docs; we will require it to be non-null
    isLibrary?: boolean,
    reporting?: boolean,
}
export function validateAppleMusicLibrarySongPlayParams(arg: AppleMusicLibrarySongPlayParams | any): arg is AppleMusicLibrarySongPlayParams {
    // LogManager.info("validateAppleMusicAppleMusicPlayParams() inputs:", { arg: arg });
    if (!arg) {
        LogManager.info("validateAppleMusicLibrarySongPlayParams() recieved arg that was null/undefined:", { arg: arg })
        return false;
    }
    const idValidate = typeof arg.id === "string";
    const kindValidate = typeof arg.kind === "string";
    const catalogIDValidate = typeof arg.catalogId === "string";

    // Validating optional properties 
    const isLibraryValidate = arg.isLibrary ? typeof arg.isLibrary === "boolean" : true;
    const reportingValidate = arg.reporting ? typeof arg.reporting === "boolean" : true;

    const validationStatus = idValidate && kindValidate && isLibraryValidate
        && catalogIDValidate && reportingValidate;

    if (!validationStatus) {
        LogManager.info("validateAppleMusicLibrarySongPlayParams() failed validation:", {
            arg: arg,
            idValidate: idValidate, kindValidate: kindValidate,
            isLibraryValidate: isLibraryValidate, catalogIDValidate: catalogIDValidate,
            reportingValidate: reportingValidate,
        });
    }

    return validationStatus;
}

// https://developer.apple.com/documentation/applemusicapi/librarysong/attributes
export type AppleMusicLibrarySongAttributes = {
    name: string,
    // --> Will not be null
    artwork: AppleMusicArtwork,
    // --> Will not be null
    artistName: string,
    // --> Will not be null
    albumName: string,
    // --> Will not be null
    discNumber: number,
    // --> Will not be null
    trackNumber: number,
    // --> Will not be null
    genreNames?: string[],
    durationInMillis?: number,
    // releaseDate?: string,
    // hasLyrics?: boolean,
    playParams: AppleMusicLibrarySongPlayParams,
    // --> Can be null according to Apple Music API docs; we will require it to be null
}
export function validateAppleMusicLibrarySongAttributes(arg: AppleMusicLibrarySongAttributes | any): arg is AppleMusicLibrarySongAttributes {
    // LogManager.info("validateAppleMusicLibrarySongAttributes() inputs:", { arg: arg });

    if (!arg) {
        LogManager.info("validateAppleMusicLibrarySongAttributes failed because provided arg was null/undefined:", arg)
        return false;
    }
    const artworkValidate = validateAppleMusicArtwork(arg.artwork);
    const artistNameValidate = typeof arg.artistName === "string";
    const nameValidate = typeof arg.name === "string";
    const albumNameValidate = typeof arg.albumName === "string";
    const playParamsValidate = validateAppleMusicLibrarySongPlayParams(arg.playParams);

    // Validate optional properties 
    const genreNamesValidate = arg.genreNames ? Array.isArray(arg.genreNames) : true; // TODO: also check that array items are strings
    const durationInMillisValidate = arg.durationInMillis ? typeof arg.durationInMillis === "number" : true;

    // const trackNumberValidate = typeof arg.trackNumber === "number";
    // const releaseDateValidate = typeof arg.releaseDate === "string";
    // const hasLyricsValidate = typeof arg.hasLyrics === "boolean"; 
    // const discNumberValidate = typeof arg.discNumberValidate === "number"; 

    const validationStatus = albumNameValidate && artistNameValidate && genreNamesValidate
        && durationInMillisValidate && nameValidate && playParamsValidate
        && artworkValidate;

    if (!validationStatus) {
        LogManager.info("validateAppleMusicLibrarySongAttributes() failed validation:", {
            arg: arg,
            albumNameValidate: albumNameValidate,
            artistNameValidate: artistNameValidate,
            genreNamesValidate: genreNamesValidate,
            durationInMillisValidate: durationInMillisValidate,
            nameValidate: nameValidate, playParamsValidate: playParamsValidate,
            artworkValidate: artworkValidate,
        });
    }

    return validationStatus;
}

// https://developer.apple.com/documentation/applemusicapi/librarysong
export type AppleMusicLibrarySong = {
    id: string,
    type: "librarySongs",
    // --> Will not be null 
    href?: string,
    attributes: AppleMusicLibrarySongAttributes,
    // -> Can be null 
    // relationships: (not necessary currently)
}
export function validateAppleMusicLibrarySong(arg: AppleMusicLibrarySong | any): arg is AppleMusicLibrarySong {
    // LogManager.info("validateAppleMusicLibrarySong() inputs:", { arg: arg });
    if (!arg) {
        LogManager.info("validateAppleMusicLibrarySong failed because provided arg was null/undefined:", arg)
        return false;
    }
    const idValidate = typeof arg.id === "string";
    const typeValidate = typeof arg.type === "string"
    const attributesValidate = validateAppleMusicLibrarySongAttributes(arg.attributes);

    // Validating optional properties 
    const hrefValidate = arg.href ? typeof arg.href === "string" : true;

    const validationStatus = idValidate && typeValidate &&
        hrefValidate && attributesValidate;

    if (!validationStatus) {
        LogManager.info("validateAppleMusicLibrarySong() failed validation:", {
            arg: arg,
            idValidate: idValidate, typeValidate: typeValidate,
            hrefValidate: hrefValidate, attributesValidate: attributesValidate,
        });
    }
    return validationStatus;
}


// export type DisabledAppleMusicCatalogSongAttributes = {
    //     artistName: string;
    //     isrc: string,
    //     name: string,
    //     url: string,
    //     composerName?: string,
    //     discNumber?: number,
    //     durationInMillis: number,
    //     genreNames?: Array<string>,
    //     playParams?: AppleMusicCatalogSongPlayParams,
    //     previews?: Array<AppleMusicCatalogSongPreview>,
    //     releaseDate?: string,
    //     trackNumber?: number,
    //     hasLyrics?: boolean,
    //     artwork?: AppleMusicCatalogSongAttributesArtwork
    // }
    // export function validateDisabledAppleMusicCatalogSongAttributes(arg: DisabledAppleMusicCatalogSongAttributes | any): arg is DisabledAppleMusicCatalogSongAttributes {
    //     LogManager.info("validateDisabledAppleMusicCatalogSongAttributes() inputs:", { arg: arg });

    //     if (arg === null || arg === undefined) {
    //         LogManager.info("validateDisabledAppleMusicCatalogSongAttributes failed because provided arg was null/undefined:", arg)
    //         return false;
    //     }

    //     const artistNameValidate = typeof arg.artistName === "string";
    //     const isrcValidate = typeof arg.isrc === "string";
    //     const nameValidate = typeof arg.name === "string";
    //     const urlValidate = typeof arg.url === "string";

    //     LogManager.info("validateDisabledAppleMusicCatalogSongAttributes() outputs:", { artistNameValidate: artistNameValidate, isrcValidate: isrcValidate, nameValidate: nameValidate, urlValidate: urlValidate });
    //     return artistNameValidate && isrcValidate && nameValidate && urlValidate;
    // }

    // export type DisabledAppleMusicCatalogSong = {
    //     attributes: DisabledAppleMusicCatalogSongAttributes,
    //     href: string,
    //     id: string,
    //     // relationships: no need for this currently 
    //     type: string // TODO: make this a custom type  
    // }
    // export function validateDisabledAppleMusicCatalogSong(arg: DisabledAppleMusicCatalogSong | any): arg is DisabledAppleMusicCatalogSong {
    //     if (arg === null || arg === undefined) {
    //         LogManager.info("validateDisabledAppleMusicCatalogSong failed because provided arg was null/undefined:", arg)
    //         return false;
    //     }
    //     const attributesValidate = validateDisabledAppleMusicCatalogSongAttributes(arg.attributes);
    //     const idValidate = typeof arg.id === "string";
    //     const typeValidate = typeof arg.type === "string";
    //     const hrefValidate = typeof arg.href === "string";

    //     LogManager.info("validateDisabledAppleMusicCatalogSong() outputs", { attributesValidate: attributesValidate, idValidate: idValidate, typeValidate: typeValidate, hrefValidate: hrefValidate });
    //     return attributesValidate && idValidate && typeValidate && hrefValidate;
    // }

    // export type AppleMusicCatalogSongAttributesArtwork = {
//     width?: number,
//     height?: number,
//     url: string,
//     bgColor: string,
//     textColor1?: string,
//     textColor2?: string
//     textColor3?: string,
//     textColor4?: string
// }
// function validateAppleMusicCatalogSongAttributesArtwork(arg: AppleMusicCatalogSongAttributesArtwork | any): arg is AppleMusicCatalogSongAttributesArtwork {
//     LogManager.info("validateAppleMusicCatalogSongAttributesArtwork() inputs:", { arg: arg });
//     if (arg === null || arg === undefined) {
//         LogManager.info("validateAppleMusicCatalogSongAttributesArtwork() failed because provided arg was null/undefined:", arg)
//         return false;
//     }
//     // const widthValidate = typeof arg.width === "number"; 
//     // const heightValidate = typeof arg.height === "number"; 
//     const urlValidate = typeof arg.url === "string";
//     const bgColorValidate = typeof arg.bgColor === "string";
//     // const textColor1Validate = typeof arg.textColor1 === "string"; // No need for these right now
//     // const textColor2Validate = typeof arg.textColor2 === "string";
//     // const textColor3Validate = typeof arg.textColor3 === "string";     
//     // const textColor4Validate = typeof arg.textColor4 === "string";
//     LogManager.info(`validateAppleMusicCatalogSongAttributesArtwork() output:`, { urlValidate: urlValidate, bgColorValidate: bgColorValidate });
//     return urlValidate && bgColorValidate;
// }
// https://developer.apple.com/documentation/applemusicapi/playparameters
// export type AppleMusicCatalogSongPlayParams = {
//     id: string,
//     // --> Will not be null
//     kind: string
//     // --> Will not be null
// }
// export function validateAppleMusicCatalogSongPlayParams(arg: AppleMusicCatalogSongPlayParams | any, allowNullValues: boolean): arg is AppleMusicCatalogSongPlayParams {
//     if (arg === null || arg === undefined) {
//         LogManager.info("validateAppleMusicCatalogSongPlayParams recieved arg that was null/undefined:",
//             { arg: arg, allowNullValues: allowNullValues });
//         return allowNullValues;
//     }
//     const idValidate = typeof arg.id === "string";
//     const kindValidate = typeof arg.kind === "string";
//     LogManager.info("validateAppleMusicCatalogSongPlayParams() output:", { idValidate: idValidate, kindValidate: kindValidate });
//     return idValidate && kindValidate;
// }