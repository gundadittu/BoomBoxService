export type AppleMusicLibrarySongAttributesPlayParams = {
    id: string,
    kind: string,
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
    return urlValidate
}

export type AppleMusicLibrarySongAttributes = {
    artwork: AppleMusicLibrarySongAttributesArtwork,
    artistName: string,
    discNumber?: string,
    genreNames: string[],
    durationInMillis: number,
    releaseDate: string,
    name: string,
    hasLyrics?: boolean,
    albumName?: string,
    playParams: AppleMusicLibrarySongAttributesPlayParams,
    trackNumber: number
}
export function validateAppleMusicLibrarySongAttributes(arg: AppleMusicLibrarySongAttributes | any): arg is AppleMusicLibrarySongAttributes {
    if (arg == null || arg == undefined) {
        return false;
    }
    const artworkValidate = validateAppleMusicLibrarySongAttributesArtwork(arg.artwork);
    const artistNameValidate = typeof arg.artistName == "string";
    const genreNamesValidate = Array.isArray(arg.genreNames);
    const durationInMillisValidate = typeof arg.durationInMillis == "number";
    const releaseDateValidate = typeof arg.releaseDate == "string";
    const nameValidate = typeof arg.name === "string";
    const playParamsValidate = validateAppleMusicLibrarySongAttributesPlayParams(arg.playParams);
    const trackNumberValidate = typeof arg.trackNumber == "number";
    return artworkValidate && artistNameValidate && genreNamesValidate && durationInMillisValidate && releaseDateValidate && nameValidate && playParamsValidate && trackNumberValidate
}

export type AppleMusicLibrarySong = {
    id: string,
    type: string,
    href: string,
    attributes: AppleMusicLibrarySongAttributes
}
export function validateAppleMusicLibrarySong(arg: AppleMusicLibrarySong | any): arg is AppleMusicLibrarySongsResponse {
    if (arg == null || arg == undefined) {
        return false;
    }
    const idValidate = typeof arg.id == "string";
    const typeValidate = typeof arg.type == "string"
    const hrefValidate = typeof arg.href == "string"
    const attributesValidate = validateAppleMusicLibrarySongAttributes(arg.attributes);
    return idValidate && typeValidate && hrefValidate && attributesValidate
}

export type AppleMusicLibrarySongsResponse = {
    next?: string,
    data: AppleMusicLibrarySong[]
}
export function validateAppleMusicLibrarySongResponse(arg: AppleMusicLibrarySongsResponse | any): arg is AppleMusicLibrarySongsResponse {
    if (arg == null || arg == undefined) {
        return false;
    }
    const data = arg.data;
    let dataValidation = data !== undefined && Array.isArray(arg.data);
    if (dataValidation) {
        for (var i = 0; i < data.length; i++) {
            // Validate if array contains AppleMusicLibrarySong objects 
            if (!validateAppleMusicLibrarySong(data[i])) {
                return false
            }
        }
    } else {
        return false;
    }
    return true;
}