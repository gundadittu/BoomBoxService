import { LogManager } from '../index';

// https://developer.spotify.com/documentation/web-api/reference/object-model/#external-id-object
export type SpotifyExternalIds = {
    isrc: string,
    // ean: string, 
    // upc: string 
}
export function validateSpotifyExternalIds(arg: SpotifyExternalIds | any): arg is SpotifyExternalIds {
    // LogManager.info("validateSpotifyExternalIds() inputs:", { arg: arg });
    if (!arg) {
        LogManager.info("validateSpotifyExternalIds failed because provided arg was null/undefined:", arg)
        return false;
    }
    const isrcValidate = typeof arg.isrc === "string";

    const validationStatus = isrcValidate;

    if (!validationStatus) {
        LogManager.info("validateSpotifyExternalIds() failed validation:", { arg: arg, isrcValidate: isrcValidate });
    }
    return validationStatus;
}

// https://developer.spotify.com/documentation/web-api/reference/object-model/#external-url-object
export type SpotifyExternalUrl = {
    spotify: string,
}
export function validateSpotifyExternalUrl(arg: SpotifyExternalUrl | any): arg is SpotifyExternalUrl {
    // LogManager.info("validateSpotifyExternalUrl() inputs:", { arg: arg });
    if (!arg) {
        LogManager.info("validateSpotifyExternalUrl recieved arg that was null/undefined:", { arg: arg })
        return false;
    }
    const spotifyValidate = typeof arg.spotify === "string";

    const validationStatus = spotifyValidate;

    if (!validationStatus) {
        LogManager.info("validateSpotifyExternalUrl() failed validation:", {
            arg: arg, spotifyValidate: spotifyValidate,
        });
    }
    return validationStatus;
}

// https://developer.spotify.com/documentation/web-api/reference/object-model/#artist-object-simplified
// https://developer.spotify.com/documentation/web-api/reference/object-model/#artist-object-full
export type SpotifyArtist = {
    href: string,
    id: string,
    name: string,
    uri: string,
    external_urls?: SpotifyExternalUrl,
    images?: Array<SpotifyImage>,
    // --> ** NOT ** included in simplified verison of artist object

    // TODO: Other properties only included in full version of artist object
    // popularity: number
    // genres: Array<string>
    // followers
}
export function validateSpotifyArtist(arg: SpotifyArtist | any): arg is SpotifyArtist {
    // LogManager.info("validateSpotifyArtist() inputs:", { arg: arg });
    if (!arg) {
        LogManager.info("validateSpotifyArtist failed because provided arg was null/undefined:", arg)
        return false;
    }
    const idValidate = typeof arg.id === "string";
    const hrefValidate = typeof arg.href === "string";
    const nameValidate = typeof arg.name === "string";
    const uriValidate = typeof arg.uri === "string";

    // Optional properties validation

    const external_urlsValidate = arg.external_urls ? validateSpotifyExternalUrl(arg.external_urls) : true;

    const validateOptionalImageList = () => {
        const images = arg.images;
        if (!images) {
            return true;
        } else if (Array.isArray(images)) {
            return (images.filter((value, _1, _2) => validateSpotifyImage(value)).length) === images.length;
        } else {
            return false
        }
    }
    const imagesValidate = validateOptionalImageList();

    const validationStatus = idValidate && hrefValidate && nameValidate &&
        uriValidate && external_urlsValidate && imagesValidate;

    if (!validationStatus) {
        LogManager.info("validateSpotifyArtist() outputs:", {
            external_urlsValidate: external_urlsValidate, idValidate: idValidate,
            hrefValidate: hrefValidate, nameValidate: nameValidate,
            uriValidate: uriValidate, imagesValidate: imagesValidate,
        });
    }

    return validationStatus;
}

// https://developer.spotify.com/documentation/web-api/reference/object-model/#copyright-object
export type SpotifyCopyright = {
    text: string,
    type: "P" | "C",
}
export function validateSpotifyCopyright(arg: SpotifyCopyright | any): arg is SpotifyCopyright {
    if (!arg) {
        LogManager.info("validateSpotifyCopyright failed because provided arg was null/undefined:", arg)
        return false;
    }
    const textValidate = typeof arg.text === "string";
    const typeValidate = arg.type === "P" || arg.type === "C";

    const validationStatus = textValidate && typeValidate;

    if (!validationStatus) {
        LogManager.info("validateSpotifyCopyright failed validation:", {
            arg: arg,
            textValidate: textValidate,
            typeValidate: typeValidate,
        });
    }

    return textValidate && typeValidate;
}
// https://developer.spotify.com/documentation/web-api/reference/object-model/#image-object
export type SpotifyImage = {
    url: string,
    height?: number,
    width?: number,
}
export function validateSpotifyImage(arg: SpotifyImage | any): arg is SpotifyImage {
    if (!arg) {
        LogManager.info("validateSpotifyImage was given arg that was null/undefined:", arg);
        return false;
    }

    const urlValidate = typeof arg.url === "string";

    // Validating optional properties 
    const heightValidate = arg.height ? typeof arg.height === "number" : true;
    const widthValidate = arg.width ? typeof arg.width === "number" : true;

    const validationStatus = urlValidate && heightValidate && widthValidate

    if (!validationStatus) {
        LogManager.info("validateSpotifyImage failed validation:", {
            arg: arg, urlValidate: urlValidate, heightValidate: heightValidate,
            widthValidate: widthValidate,
        });
    }

    return validationStatus;
}

// https://developer.spotify.com/documentation/web-api/reference/object-model/#album-object-simplified
// https://developer.spotify.com/documentation/web-api/reference/object-model/#album-object-full
export type SpotifyAlbum = {
    name: string,
    artists: Array<SpotifyArtist>,
    // --> Usually will be an array of SIMPLIFIED artist objects  
    id: string,
    uri: string,
    href: string,
    external_ids?: SpotifyExternalIds,
    // --> **NOT** included in simplified version of album object
    album_type?: "album" | "single" | "compilation", // TODO: fix check in validator
    available_markets?: Array<string>,
    copyrights?: Array<SpotifyCopyright>,
    // --> **NOT** included in simplified version of album object
    external_urls?: SpotifyExternalUrl,
    genres?: Array<string>,
    // --> **NOT** included in simplified version of album object
    images?: Array<SpotifyImage>,
    label?: string,
    // --> **NOT** included in simplified version of album object
    popularity?: number,
    // --> **NOT** included in simplified version of album object
    release_date?: string,
    release_date_precision?: "year" | "month" | "day", // TODO: fix check in validator
    type?: "album",
    // tracks: Array<SpotifyTrack>, TODO: add this check to validator below + will throw error since external_ids are not included in simplifed object of track
    // restrictions: 
}
export function validateSpotifyAlbum(arg: SpotifyAlbum | any): arg is SpotifyAlbum {
    if (!arg) {
        LogManager.info("validateSpotifyAlbum recieved null arg:", arg);
        return false;
    }

    const nameValidate = typeof arg.name === "string";
    const validateAllArtists = (artistList: any): Boolean => {
        if (artistList === null || artistList === undefined) {
            LogManager.info("validateAllArtists failed because provided arg was null/undefined:", artistList)
            return false;
        } else if (!Array.isArray(artistList)) {
            LogManager.info("validateAllArtists failed because provided arg was not an array:", artistList)
            return false;
        } else {
            for (const artist of artistList) {
                if (!validateSpotifyArtist(artist)) {
                    return false;
                }
            }
            return true;
        }
    }
    const artistsValidate = validateAllArtists(arg.artists);
    const idValidate = typeof arg.id === "string";
    const external_idsValidate = validateSpotifyExternalIds(arg.external_ids);
    const hrefValidate = typeof arg.href === "string";

    // Optional properties validation below:

    const album_typeValidate = arg.album_type ? typeof arg.album_type === "string" : true;

    const validateOptionalImageList = () => {
        const images = arg.images;
        if (!images) {
            return true;
        } else if (Array.isArray(images)) {
            return (images.filter((value, _1, _2) => validateSpotifyImage(value)).length) === images.length;
        } else {
            return false
        }
    }
    const imagesValidate = validateOptionalImageList();

    const validateOptionalAvailableMarketsList = () => {
        const available_markets = arg.available_markets;
        if (!available_markets) {
            return true;
        } else if (Array.isArray(available_markets)) {
            return (available_markets.filter((value, _1, _2) => typeof value === "string").length) === available_markets.length;
        } else {
            return false;
        }
    }
    const available_marketsValidate = validateOptionalAvailableMarketsList();

    const validateOptionalCopyrightsList = () => {
        const copyrights = arg.copyrights;
        if (copyrights) {
            if (Array.isArray(copyrights)) {
                return (copyrights.filter((value, _1, _2) => validateSpotifyCopyright(value)).length) === copyrights.length;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    const copyrightsValidate = validateOptionalCopyrightsList();

    const external_urlsValidate = arg.external_urls ? validateSpotifyExternalUrl(arg.external_urls) : true;

    const validateOptionalGenresList = () => {
        const genres = arg.genres;
        if (genres) {
            if (Array.isArray(genres)) {
                return (genres.filter((value, _1, _2) => typeof value === "string").length) === genres.length;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    const genresValidate = validateOptionalGenresList();

    const labelValidate = arg.label ? typeof arg.label === "string" : true;
    const popularityValidate = arg.popularity ? typeof arg.popularity === "number" : true;
    const release_dateValidate = arg.release_date ? typeof arg.release_date === "string" : true;
    const release_date_precisionValidate = arg.release_date_precision ? typeof arg.release_date_precision === "string" : true;
    const typeValidate = arg.type ? arg.type === "album" : true;
    const uriValidate = arg.uri ? typeof arg.uri === "string" : true;

    const validationStatus = (imagesValidate && artistsValidate &&
        nameValidate && idValidate && external_idsValidate &&
        album_typeValidate && available_marketsValidate && copyrightsValidate
        && external_urlsValidate && genresValidate && hrefValidate
        && labelValidate && popularityValidate && release_dateValidate
        && release_date_precisionValidate && typeValidate && uriValidate);

    if (!validationStatus) {
        LogManager.info("validateSpotifyAlbum() failed validation:", {
            arg: arg,
            hrefValidate: hrefValidate,
            popularityValidate: popularityValidate,
            labelValidate: labelValidate,
            release_dateValidate: release_dateValidate,
            release_date_precisionValidate: release_date_precisionValidate,
            typeValidate: typeValidate,
            uriValidate: uriValidate,
            genresValidate: genresValidate,
            external_urlsValidate: external_urlsValidate,
            copyrightsValidate: copyrightsValidate,
            available_marketsValidate: available_marketsValidate,
            imagesValidate: imagesValidate,
            album_typeValidate: album_typeValidate,
            external_idsValidate: external_idsValidate,
            idValidate: idValidate,
            artistsValidate: artistsValidate,
            nameValidate: nameValidate,
        });
    }
    return validationStatus;
}

// https://developer.spotify.com/documentation/web-api/reference/object-model/#track-object-simplified
// https://developer.spotify.com/documentation/web-api/reference/object-model/#track-object-full
export type SpotifyTrack = {
    album: SpotifyAlbum, // TODO: finish adding tracks property to album
    // --> Will be a simplified album object
    artists: Array<SpotifyArtist>,
    // --> Will be a an array of SIMPLIFIED artist objects 
    duration_ms: number,
    external_ids: SpotifyExternalIds
    // --> ** NOT ** included in simplified track object (library api request includes full track objects)
    id: string,
    name: string,
    uri: string,
    href: string,
    is_local: boolean,
    available_markets?: Array<string>,
    disc_number?: number,
    explicit?: boolean,
    // --> ** NOT ** included in simplified track object
    external_urls?: SpotifyExternalUrl
    popularity?: number,
    // --> ** NOT ** included in simplified track object
    preview_url?: string,
    track_number?: number,
    type?: "track",
    // restrictions
    // is_playable?: boolean,
    // linked_from: SpotifyTrack,
}
export function validateSpotifyTrack(arg: SpotifyTrack | any): arg is SpotifyTrack {
    // LogManager.info("validateSpotifyTrack() inputs:", { arg: arg });
    if (!arg) {
        LogManager.info("validateSpotifyTrack failed because provided arg was null/undefined:", arg)
        return false;
    }
    const duration_msValidate = typeof arg.duration_ms === "number";
    const external_idsValidate = validateSpotifyExternalIds(arg.external_ids);
    const idValidate = typeof arg.id === "string";
    const nameValidate = typeof arg.name === "string";
    const uriValidate = typeof arg.uri === "string";
    const hrefValidate = typeof arg.href === "string";
    const is_localValidate = typeof arg.is_local === "boolean";

    const validateAllArtists = (artistList: any): Boolean => {
        if (!artistList) {
            LogManager.info("validateAllArtists failed because provided arg was null/undefined:", artistList)
            return false;
        } else if (!Array.isArray(artistList)) {
            LogManager.info("validateAllArtists failed because provided arg was not an array:", artistList)
            return false;
        } else {
            for (const artist of artistList) {
                if (!validateSpotifyArtist(artist)) {
                    return false;
                }
            }
            return true;
        }
    }
    const artistsValidate = validateAllArtists(arg.artists);

    // Validate optional properties 
    const disc_numberValidate = arg.disc_number ? typeof arg.disc_number === "number" : true;
    const explicitValidate = arg.explicit ? typeof arg.explicit === "boolean" : true;
    // const is_playableValidate = typeof arg.is_playable === "boolean";
    const popularityValidate = typeof arg.popularity === "number";
    const preview_urlValidate = arg.preview_url ? typeof arg.preview_url === "string" : true;
    const track_numberValidate = arg.track_number ? typeof arg.track_number === "number" : true;
    const typeValidate = arg.type ? arg.type === "track" : true;
    const external_urlsValidate = arg.external_urls ? validateSpotifyExternalUrl(arg.external_urls) : true;
    const validateOptionalAvailableMarketsList = () => {
        const available_markets = arg.available_markets;
        if (!available_markets) {
            return true;
        } else if (Array.isArray(available_markets)) {
            return (available_markets.filter((value, _1, _2) => typeof value === "string").length) === available_markets.length;
        } else {
            return false;
        }
    }
    const available_marketsValidate = validateOptionalAvailableMarketsList();

    const validationStatus = (external_urlsValidate && available_marketsValidate && hrefValidate &&
        artistsValidate && duration_msValidate && external_idsValidate &&
        idValidate && nameValidate && uriValidate && disc_numberValidate &&
        explicitValidate && popularityValidate && preview_urlValidate &&
        track_numberValidate && typeValidate && is_localValidate);

    if (!validationStatus) {
        LogManager.info("validateSpotifyTrack() failed validation:", {
            arg: arg,
            typeValidate: typeValidate, artistsValidate: artistsValidate,
            disc_numberValidate: disc_numberValidate, duration_msValidate: duration_msValidate,
            explicitValidate: explicitValidate, idValidate: idValidate,
            nameValidate: nameValidate, popularityValidate: popularityValidate,
            preview_urlValidate: preview_urlValidate, track_numberValidate: track_numberValidate,
            uriValidate: uriValidate, is_localValidate: is_localValidate,
            external_urlsValidate: external_urlsValidate, available_marketsValidate: available_marketsValidate,
            external_idsValidate: external_idsValidate, hrefValidate: hrefValidate,
        });
    }

    return validationStatus;
}

// https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks
export type SpotifySavedTrack = {
    // TODO: added_at: timestamp,
    track: SpotifyTrack
}
export function validateSpotifySavedTrack(arg: SpotifySavedTrack | any): arg is SpotifySavedTrack {
    if (!arg) {
        LogManager.info("validateSpotifySavedTrack failed because provided arg was null/undefined:", arg)
        return false;
    }
    // const added_atValidate = typeof arg.added_at === "number";
    const trackValidate = validateSpotifyTrack(arg.track);

    const validationStatus = trackValidate;
    if (!validationStatus) {
        LogManager.info("validateSpotifySavedTrack() failed validation:", {
            arg: arg,
            trackValidate: trackValidate,
        });
    }
    return validationStatus;
}