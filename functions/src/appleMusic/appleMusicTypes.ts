// TODO: add proper logging so I can know what type of responses/songs are failing + what data they are missing

export type AppleMusicCatalogSongPreview = {
    url: string
}
export function validateAppleMusicCatalogSongPreview(arg: AppleMusicCatalogSongPreview | any): arg is AppleMusicCatalogSongPreview {
    if (arg == null || arg == undefined) {
        return false;
    }
    return typeof arg.url == "string";
}

export type AppleMusicCatalogSongAttributesArtwork = {
    width?: number,
    height?: number,
    url: string,
    bgColor: string,
    textColor1?: string,
    textColor2?: string
    textColor3?: string,
    textColor4?: string
}
function validateAppleMusicCatalogSongAttributesArtwork(arg: AppleMusicCatalogSongAttributesArtwork | any): arg is AppleMusicCatalogSongAttributesArtwork {
    if (arg == null || arg == undefined) {
        return false;
    }
    // const widthValidate = typeof arg.width == "number"; 
    // const heightValidate = typeof arg.height == "number"; 
    const urlValidate = typeof arg.url == "string";
    const bgColorValidate = typeof arg.bgColor == "string";
    // const textColor1Validate = typeof arg.textColor1 == "string"; // No need for these right now
    // const textColor2Validate = typeof arg.textColor2 == "string";
    // const textColor3Validate = typeof arg.textColor3 == "string";     
    // const textColor4Validate = typeof arg.textColor4 == "string";
    return urlValidate && bgColorValidate;
}

export type AppleMusicCatalogSongPlayParams = {
    id: string,
    kind: string // TODO: make this a custom type
}
export function validateAppleMusicCatalogSongPlayParams(arg: AppleMusicCatalogSongPlayParams | any): arg is AppleMusicCatalogSongPlayParams {
    if (arg == null || arg == undefined) {
        return false;
    }
    const idValidate = typeof arg.id == "string";
    const kindValidate = typeof arg.kind == "string";
    return idValidate && kindValidate;
}

export type AppleMusicCatalogSongAttributes = {
    artistName: string;
    composerName: string,
    discNumber?: number,
    durationInMillis: number,
    genreNames: Array<string>,
    isrc: string,
    name: string,
    playParams: AppleMusicCatalogSongPlayParams,
    previews: Array<AppleMusicCatalogSongPreview>,
    releaseDate: string,
    trackNumber?: number,
    url: string,
    hasLyrics?: boolean,
    artwork: AppleMusicCatalogSongAttributesArtwork
}
export function validateAppleMusicCatalogSongAttributes(arg: AppleMusicCatalogSongAttributes | any): arg is AppleMusicCatalogSongAttributes {
    if (arg == null || arg == undefined) {
        return false;
    }

    const durationInMillisValidate = typeof arg.durationInMillis == "number";
    const artistNameValidate = typeof arg.artistName == "string";
    // const composerNameValidate = typeof arg.composerName == "string";
    const genreNamesValidate = Array.isArray(arg.genreNames);
    const isrcValidate = typeof arg.isrc == "string";
    const nameValidate = typeof arg.name == "string";
    const playParamsValidate = validateAppleMusicCatalogSongPlayParams(arg.playParams)
    // const previewsValidate = validateAppleMusicCatalogSongPreview(arg.previews); // not necessary 
    const releaseDateValidate = typeof arg.releaseDate == "string";
    const urlValidate = typeof arg.url == "string";
    const artworkValidate = validateAppleMusicCatalogSongAttributesArtwork(arg.artwork);
    // const trackNumberValidate = typeof arg.trackNumber == "string"; // No need for these currently 
    // const hasLyricsValidate = typeof arg.hasLyrics == "boolean"; 
    // const discNumberValidate = typeof arg.discNumberValidate == "number"; 
    // console.log("validateAppleMusicCatalogSongAttributes: " + artworkValidate + durationInMillisValidate + artistNameValidate + genreNamesValidate + isrcValidate + nameValidate + releaseDateValidate + playParamsValidate + urlValidate);
    return artworkValidate && durationInMillisValidate && artistNameValidate && genreNamesValidate && isrcValidate && nameValidate && releaseDateValidate && playParamsValidate && urlValidate;
}

export type AppleMusicCatalogSong = {
    attributes: AppleMusicCatalogSongAttributes,
    href: string,
    id: string,
    // relationships: no need for this currently 
    type: string // TODO: make this a custom type  
}
export function validateAppleMusicCatalogSong(arg: AppleMusicCatalogSong | any): arg is AppleMusicCatalogSong {
    if (arg == null || arg == undefined) {
        return false;
    }
    const attributesValidate = validateAppleMusicCatalogSongAttributes(arg.attributes);
    const idValidate = typeof arg.id == "string";
    const typeValidate = typeof arg.type == "string";
    const hrefValidate = typeof arg.href == "string";
    // console.log("validateAppleMusicCatalogSong: " + attributesValidate + idValidate + typeValidate + hrefValidate);
    return attributesValidate && idValidate && typeValidate && hrefValidate;
}

// export type AppleMusicCatalogSongsResponse = {
//     data: Array<AppleMusicCatalogSong>
// }
// export function validateAppleMusicCatalogSongsResponse(arg: AppleMusicCatalogSongsResponse | any): arg is AppleMusicCatalogSongsResponse {
//     if (arg == null || arg == undefined) {
//         return false;
//     }
//     const data = arg.data;
//     let dataValidation = data !== undefined && Array.isArray(arg.data);
//     if (dataValidation) {
//         for (var i = 0; i < data.length; i++) {
//             console.log("validateAppleMusicCatalogSong started for item at index " + i);
//             if (!validateAppleMusicCatalogSong(data[i])) {
//                 return false
//             }
//         }
//     } else {
//         return false;
//     }
//     return true;
// }

export type AppleMusicLibrarySongAttributesPlayParams = {
    id: string,
    kind: string, // TODO: make this a custom type as well 
    isLibrary: boolean,
    reporting?: boolean,
    catalogId: string
}
export function validateAppleMusicLibrarySongAttributesPlayParams(arg: AppleMusicLibrarySongAttributesPlayParams | any): arg is AppleMusicLibrarySongAttributesPlayParams {
    if (arg == null || arg == undefined) {
        return false;
    }
    const idValidate = typeof arg.id == "string";
    const kindValidate = typeof arg.kind == "string";
    const isLibraryValidate = typeof arg.isLibrary == "boolean";
    const catalogIDValidate = typeof arg.catalogId == "string";
    // const reportingValidate = typeof arg.reporting == "boolean"; // No need for this
    return idValidate && kindValidate && isLibraryValidate && catalogIDValidate;
}

export type AppleMusicLibrarySongAttributesArtwork = {
    width?: number,
    height?: number,
    url: string,
}
export function validateAppleMusicLibrarySongAttributesArtwork(arg: AppleMusicLibrarySongAttributesArtwork | any): arg is AppleMusicLibrarySongAttributesArtwork {
    if (arg == null || arg == undefined) {
        return false;
    }
    const urlValidate = typeof arg.url == "string";
    // const widthValidate = typeof arg.width == "string"; 
    // const heightValidate = typeof arg.height == "string"; 
    return urlValidate
}

export type AppleMusicLibrarySongAttributes = {
    artwork?: AppleMusicLibrarySongAttributesArtwork,
    artistName: string,
    discNumber?: number,
    genreNames: string[],
    durationInMillis: number,
    releaseDate?: string,
    name: string,
    hasLyrics?: boolean,
    albumName?: string,
    playParams: AppleMusicLibrarySongAttributesPlayParams,
    trackNumber?: number
}
export function validateAppleMusicLibrarySongAttributes(arg: AppleMusicLibrarySongAttributes | any): arg is AppleMusicLibrarySongAttributes {
    if (arg == null || arg == undefined) {
        return false;
    }
    // const artworkValidate = validateAppleMusicLibrarySongAttributesArtwork(arg.artwork);
    const artistNameValidate = typeof arg.artistName == "string";
    const genreNamesValidate = Array.isArray(arg.genreNames);
    const durationInMillisValidate = typeof arg.durationInMillis == "number";
    // const releaseDateValidate = typeof arg.releaseDate == "string";
    const nameValidate = typeof arg.name === "string";
    const playParamsValidate = validateAppleMusicLibrarySongAttributesPlayParams(arg.playParams);
    // const trackNumberValidate = typeof arg.trackNumber == "number";
    // const albumNameValidate = typeof arg.albumName == "string";
    // const hasLyricsValidate = typeof arg.hasLyrics == "boolean"; 
    // const discNumberValidate = typeof arg.discNumberValidate == "number"; 
    // console.log("validateAppleMusicLibrarySongAttributes: " + artistNameValidate + genreNamesValidate + durationInMillisValidate + nameValidate + playParamsValidate);
    return  artistNameValidate && genreNamesValidate && durationInMillisValidate && nameValidate && playParamsValidate
}

export type AppleMusicLibrarySong = {
    id: string,
    type: string,
    href: string,
    attributes: AppleMusicLibrarySongAttributes
}
export function validateAppleMusicLibrarySong(arg: AppleMusicLibrarySong | any): arg is AppleMusicLibrarySong {
    if (arg == null || arg == undefined) {
        return false;
    }
    const idValidate = typeof arg.id == "string";
    const typeValidate = typeof arg.type == "string"
    const hrefValidate = typeof arg.href == "string"
    const attributesValidate = validateAppleMusicLibrarySongAttributes(arg.attributes);
    // console.log("validateAppleMusicLibrarySong: " + idValidate + typeValidate + hrefValidate + attributesValidate);
    return idValidate && typeValidate && hrefValidate && attributesValidate;
}

// export type AppleMusicLibrarySongsResponse = {
//     next?: string,
//     data: AppleMusicLibrarySong[]
// }
// export function validateAppleMusicLibrarySongResponse(arg: AppleMusicLibrarySongsResponse | any): arg is AppleMusicLibrarySongsResponse {
//     if (arg == null || arg == undefined) {
//         return false;
//     }
//     const data = arg.data;
//     let dataValidation = data !== undefined && Array.isArray(arg.data);
//     if (dataValidation) {
//         for (var i = 0; i < data.length; i++) {
//             console.log("validateAppleMusicLibrarySong started for item at index " + i);
//             if (!validateAppleMusicLibrarySong(data[i])) {
//                 console.log(data[i]);
//                 return false
//             }
//         }
//     } else {
//         return false;
//     }
//     return true;
// }