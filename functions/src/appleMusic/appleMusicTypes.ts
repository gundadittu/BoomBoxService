import { LogManager } from '../index';

export type AppleMusicCatalogSongPreview = {
    url: string
}
export function validateAppleMusicCatalogSongPreview(arg: AppleMusicCatalogSongPreview | any): arg is AppleMusicCatalogSongPreview {
    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicCatalogSongPreview failed because provided arg was null/undefined:", arg)
        return false;
    }
    return typeof arg.url === "string";
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
    LogManager.info("validateAppleMusicCatalogSongAttributesArtwork() inputs:", { arg: arg });
    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicCatalogSongAttributesArtwork() failed because provided arg was null/undefined:", arg)
        return false;
    }
    // const widthValidate = typeof arg.width === "number"; 
    // const heightValidate = typeof arg.height === "number"; 
    const urlValidate = typeof arg.url === "string";
    const bgColorValidate = typeof arg.bgColor === "string";
    // const textColor1Validate = typeof arg.textColor1 === "string"; // No need for these right now
    // const textColor2Validate = typeof arg.textColor2 === "string";
    // const textColor3Validate = typeof arg.textColor3 === "string";     
    // const textColor4Validate = typeof arg.textColor4 === "string";
    LogManager.info(`validateAppleMusicCatalogSongAttributesArtwork() output:`, { urlValidate: urlValidate, bgColorValidate: bgColorValidate });
    return urlValidate && bgColorValidate;
}

export type AppleMusicCatalogSongPlayParams = {
    id: string,
    kind: string // TODO: make this a custom type
}
export function validateAppleMusicCatalogSongPlayParams(arg: AppleMusicCatalogSongPlayParams | any): arg is AppleMusicCatalogSongPlayParams {
    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicCatalogSongPlayParams failed because provided arg was null/undefined:", arg)
        return false;
    }
    const idValidate = typeof arg.id === "string";
    const kindValidate = typeof arg.kind === "string";
    LogManager.info("validateAppleMusicCatalogSongPlayParams() output:", { idValidate: idValidate, kindValidate: kindValidate });
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
    LogManager.info("validateAppleMusicCatalogSongAttributes() input:", { arg: arg });
    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicCatalogSongAttributes failed because provided arg was null/undefined:", arg)
        return false;
    }

    const durationInMillisValidate = typeof arg.durationInMillis === "number";
    const artistNameValidate = typeof arg.artistName === "string";
    // const composerNameValidate = typeof arg.composerName === "string";
    const genreNamesValidate = Array.isArray(arg.genreNames);
    const isrcValidate = typeof arg.isrc === "string";
    const nameValidate = typeof arg.name === "string";
    const playParamsValidate = validateAppleMusicCatalogSongPlayParams(arg.playParams)
    // const previewsValidate = validateAppleMusicCatalogSongPreview(arg.previews); // not necessary 
    const releaseDateValidate = typeof arg.releaseDate === "string";
    const urlValidate = typeof arg.url === "string";
    const artworkValidate = validateAppleMusicCatalogSongAttributesArtwork(arg.artwork);
    // const trackNumberValidate = typeof arg.trackNumber === "string"; // No need for these currently 
    // const hasLyricsValidate = typeof arg.hasLyrics === "boolean"; 
    // const discNumberValidate = typeof arg.discNumberValidate === "number"; 
    // console.log("validateAppleMusicCatalogSongAttributes: " + artworkValidate + durationInMillisValidate + artistNameValidate + genreNamesValidate + isrcValidate + nameValidate + releaseDateValidate + playParamsValidate + urlValidate);

    LogManager.info("validateAppleMusicCatalogSongAttributes() output:", { durationInMillisValidate: durationInMillisValidate, artistNameValidate: artistNameValidate, genreNamesValidate: genreNamesValidate, isrcValidate: isrcValidate, nameValidate: nameValidate, playParamsValidate: playParamsValidate, releaseDateValidate: releaseDateValidate, urlValidate: urlValidate, artworkValidate: artworkValidate });
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
    LogManager.info("validateAppleMusicCatalogSong() input:", { arg: arg });
    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicCatalogSong failed because provided arg was null/undefined:", arg)
        return false;
    }
    const attributesValidate = validateAppleMusicCatalogSongAttributes(arg.attributes);
    const idValidate = typeof arg.id === "string";
    const typeValidate = typeof arg.type === "string";
    const hrefValidate = typeof arg.href === "string";

    LogManager.info("validateAppleMusicCatalogSong() outputs:", { attributesValidate: attributesValidate, idValidate: idValidate, typeValidate: typeValidate, hrefValidate: hrefValidate });
    return attributesValidate && idValidate && typeValidate && hrefValidate;
}

export type DisabledAppleMusicCatalogSongAttributes = {
    artistName: string;
    isrc: string,
    name: string,
    url: string,
    composerName?: string,
    discNumber?: number,
    durationInMillis: number,
    genreNames?: Array<string>,
    playParams?: AppleMusicCatalogSongPlayParams,
    previews?: Array<AppleMusicCatalogSongPreview>,
    releaseDate?: string,
    trackNumber?: number,
    hasLyrics?: boolean,
    artwork?: AppleMusicCatalogSongAttributesArtwork
}
export function validateDisabledAppleMusicCatalogSongAttributes(arg: DisabledAppleMusicCatalogSongAttributes | any): arg is DisabledAppleMusicCatalogSongAttributes {
    LogManager.info("validateDisabledAppleMusicCatalogSongAttributes() inputs:", { arg: arg });

    if (arg === null || arg === undefined) {
        LogManager.info("validateDisabledAppleMusicCatalogSongAttributes failed because provided arg was null/undefined:", arg)
        return false;
    }

    const artistNameValidate = typeof arg.artistName === "string";
    const isrcValidate = typeof arg.isrc === "string";
    const nameValidate = typeof arg.name === "string";
    const urlValidate = typeof arg.url === "string";

    LogManager.info("validateDisabledAppleMusicCatalogSongAttributes() outputs:", { artistNameValidate: artistNameValidate, isrcValidate: isrcValidate, nameValidate: nameValidate, urlValidate: urlValidate });
    return artistNameValidate && isrcValidate && nameValidate && urlValidate;
}

export type DisabledAppleMusicCatalogSong = {
    attributes: DisabledAppleMusicCatalogSongAttributes,
    href: string,
    id: string,
    // relationships: no need for this currently 
    type: string // TODO: make this a custom type  
}
export function validateDisabledAppleMusicCatalogSong(arg: DisabledAppleMusicCatalogSong | any): arg is DisabledAppleMusicCatalogSong {
    if (arg === null || arg === undefined) {
        LogManager.info("validateDisabledAppleMusicCatalogSong failed because provided arg was null/undefined:", arg)
        return false;
    }
    const attributesValidate = validateDisabledAppleMusicCatalogSongAttributes(arg.attributes);
    const idValidate = typeof arg.id === "string";
    const typeValidate = typeof arg.type === "string";
    const hrefValidate = typeof arg.href === "string";

    LogManager.info("validateDisabledAppleMusicCatalogSong() outputs", { attributesValidate: attributesValidate, idValidate: idValidate, typeValidate: typeValidate, hrefValidate: hrefValidate });
    return attributesValidate && idValidate && typeValidate && hrefValidate;
}

export type AppleMusicLibrarySongAttributesPlayParams = {
    id: string,
    kind: string, // TODO: make this a custom type as well 
    isLibrary: boolean,
    reporting?: boolean,
    catalogId: string
}
export function validateAppleMusicLibrarySongAttributesPlayParams(arg: AppleMusicLibrarySongAttributesPlayParams | any): arg is AppleMusicLibrarySongAttributesPlayParams {
    LogManager.info("validateAppleMusicLibrarySongAttributesPlayParams() inputs:", { arg: arg });
    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicLibrarySongAttributesPlayParams() failed because provided arg was null/undefined:", arg)
        return false;
    }
    const idValidate = typeof arg.id === "string";
    const kindValidate = typeof arg.kind === "string";
    const isLibraryValidate = typeof arg.isLibrary === "boolean";
    const catalogIDValidate = typeof arg.catalogId === "string";
    // const reportingValidate = typeof arg.reporting === "boolean"; // No need for this

    LogManager.info("validateAppleMusicLibrarySongAttributesPlayParams() inputs:", { idValidate: idValidate, kindValidate: kindValidate, isLibraryValidate: isLibraryValidate, catalogIDValidate: catalogIDValidate });
    return idValidate && kindValidate && isLibraryValidate && catalogIDValidate;
}

export type AppleMusicLibrarySongAttributesArtwork = {
    width?: number,
    height?: number,
    url: string,
}
export function validateAppleMusicLibrarySongAttributesArtwork(arg: AppleMusicLibrarySongAttributesArtwork | any): arg is AppleMusicLibrarySongAttributesArtwork {
    LogManager.info("validateAppleMusicLibrarySongAttributesArtwork() inputs:", { arg: arg });

    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicLibrarySongAttributesArtwork failed because provided arg was null/undefined:", arg)
        return false;
    }
    const urlValidate = typeof arg.url === "string";
    // const widthValidate = typeof arg.width === "string"; 
    // const heightValidate = typeof arg.height === "string"; 
    LogManager.info("validateAppleMusicLibrarySongAttributesArtwork() inputs:", { urlValidate: urlValidate });
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
    LogManager.info("validateAppleMusicLibrarySongAttributes() inputs:", { arg: arg });

    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicLibrarySongAttributes failed because provided arg was null/undefined:", arg)
        return false;
    }
    // const artworkValidate = validateAppleMusicLibrarySongAttributesArtwork(arg.artwork);
    const artistNameValidate = typeof arg.artistName === "string";
    const genreNamesValidate = Array.isArray(arg.genreNames);
    const durationInMillisValidate = typeof arg.durationInMillis === "number";
    // const releaseDateValidate = typeof arg.releaseDate === "string";
    const nameValidate = typeof arg.name === "string";
    const playParamsValidate = validateAppleMusicLibrarySongAttributesPlayParams(arg.playParams);
    // const trackNumberValidate = typeof arg.trackNumber === "number";
    // const albumNameValidate = typeof arg.albumName === "string";
    // const hasLyricsValidate = typeof arg.hasLyrics === "boolean"; 
    // const discNumberValidate = typeof arg.discNumberValidate === "number"; 
    // console.log("validateAppleMusicLibrarySongAttributes: " + artistNameValidate + genreNamesValidate + durationInMillisValidate + nameValidate + playParamsValidate);

    LogManager.info("validateAppleMusicLibrarySongAttributes() outputs:", { artistNameValidate: artistNameValidate, genreNamesValidate: genreNamesValidate, durationInMillisValidate: durationInMillisValidate, nameValidate: nameValidate, playParamsValidate: playParamsValidate });
    return artistNameValidate && genreNamesValidate && durationInMillisValidate && nameValidate && playParamsValidate
}

export type AppleMusicLibrarySong = {
    id: string,
    type: string,
    href: string,
    attributes: AppleMusicLibrarySongAttributes
}
export function validateAppleMusicLibrarySong(arg: AppleMusicLibrarySong | any): arg is AppleMusicLibrarySong {
    LogManager.info("validateAppleMusicLibrarySong() inputs:", { arg: arg });
    if (arg === null || arg === undefined) {
        LogManager.info("validateAppleMusicLibrarySong failed because provided arg was null/undefined:", arg)
        return false;
    }
    const idValidate = typeof arg.id === "string";
    const typeValidate = typeof arg.type === "string"
    const hrefValidate = typeof arg.href === "string"
    const attributesValidate = validateAppleMusicLibrarySongAttributes(arg.attributes);
    // console.log("validateAppleMusicLibrarySong: " + idValidate + typeValidate + hrefValidate + attributesValidate);
    LogManager.info("validateAppleMusicLibrarySong() outputs:", { idValidate: idValidate, typeValidate: typeValidate, hrefValidate: hrefValidate, attributesValidate: attributesValidate });
    return idValidate && typeValidate && hrefValidate && attributesValidate;
}