import axios from 'axios';
import {
    // AppleMusicLibrarySongsResponse,
    validateAppleMusicLibrarySongResponse,
    AppleMusicLibrarySong,
    // validateAppleMusicLibrarySong,
    // AppleMusicLibrarySongAttributes,
    // validateAppleMusicLibrarySongAttributes,
    // AppleMusicLibrarySongAttributesArtwork, 
    // validateAppleMusicLibrarySongAttributesArtwork, 
    // AppleMusicLibrarySongAttributesPlayParams, 
    // validateAppleMusicLibrarySongAttributesPlayParams
} from './appleMusicTypeValidator';
// import { config } from 'firebase-functions';

// https://www.npmjs.com/package/axios
// https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
/* Relevant Docs
    - https://crunchybagel.com/integrating-apple-music-into-your-ios-app/
    - https://developer.apple.com/documentation/applemusicapi/get_all_library_songs
*/

// store credential in a secure way
const appleMusicKitDevToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikg5N1gyNDRXRzQifQ.eyJpc3MiOiJKUTRLOEVFNzdQIiwiaWF0IjoxNjA4NDAwODA3LCJleHAiOjE2MjIzMDc2MDd9.vNFIr68DREmo6TpIpjExAnsXD8fLW0fW_QdWUPxuGTloKCrSIsBXzmIRCoaoAzRNPhkTi258l-pKg5VmCFqNbw";

export const fetchAppleMusicUserLibrarySongs = async (accessToken: String): Promise<Array<AppleMusicLibrarySong>> => {
    // const accessToken = "AiMnP2f9jea8Opt5Sr48si3I+ehObpOr00LpEWzblEAWg/oxSgl1j/rxDynzl9frFrQAf0v+OlDGQEDwqJCv2xriCwmnuNxKkPu+9OY8fjHMGnUMMOD5BQDx2AXN58f+PAnPLxSnwzhAYLZAOSzUm9i+tSTHx+gNIOzStvkNERUHHbj7lB3S8MkeB7rhYPjPSNDpaE0qBlYbsXL4tM89EhmTmgT908OjSCuKyy0EGpQBkQ4dsA==";
    const executeLibrarySongsPaginatedRequest = async (): Promise<Array<any>> => {
        var allData: AppleMusicLibrarySong[] = [];

        var urlPath: string | null = '/v1/me/library/songs';
        while (urlPath != null && urlPath != undefined) {
            // https://developer.apple.com/documentation/applemusicapi/songs
            try {
                const librarySongsReq = await axios({
                    method: 'get',
                    baseURL: 'https://api.music.apple.com/',
                    url: urlPath,
                    params: {
                        limit: 100,
                        include: ['catalog']
                    },
                    headers: {
                        Authorization: ' Bearer ' + appleMusicKitDevToken,
                        'Music-User-Token': accessToken
                    }
                });
                const jsonResponse = librarySongsReq.data;
                const response = JSON.parse(jsonResponse);
                if (validateAppleMusicLibrarySongResponse(response)) {
                    const data = response.data;
                    allData.push(...data);
                    urlPath = response.next || null;
                } else { 
                    // report this error 
                    throw Error("There was an issue getting your music from Apple Music.");
                }
            } catch (_) {
                // https://developer.apple.com/documentation/applemusicapi/error  
                // report error properly here 
                throw Error("There was an issue getting your music from Apple Music.");
            }
        }
        return allData;
    }

    const allSongs = await executeLibrarySongsPaginatedRequest();
    return allSongs; 

    // var allSongsCatalogIds: string[] = []
    // for (var i = 0; i < allSongs.length; i++) {
    //     const song = allSongs[i] as AppleMusicLibrarySong;
    //     const attributes = song.attributes as AppleMusicLibrarySongAttributes;
    //     const playParams: AppleMusicLibrarySongAttributesPlayParams = attributes.playParams;
    //     allSongsCatalogIds.push(playParams.catalogId);
    // }
    // const allSongsCatalogIds: string[] = allSongs.map((value, _1, _2) => {
    //     const songObject = value; 
    //     const catalogID = songObject.attributes.playParams.catalogId;
    //     return catalogID;
    // });
    // const allSongsCatalogData = await fetchCatalogDataForAppleMusicSongs(allSongsCatalogIds);
    // return allSongsCatalogData;
}

export const fetchCatalogDataForAppleMusicSongs = async (catalogIds: string[]): Promise<Array<string>> => {
    // split ids into chunks of 250 (API has a max of 300 ids per request)
    var idChunks = [];
    var i, j, chunkSize = 300;
    for (i = 0, j = catalogIds.length; i < j; i += chunkSize) {
        const temp = catalogIds.slice(i, i + chunkSize);
        idChunks.push(temp);
    }

    var allData: string[] = [];
    for (const chunk of idChunks) {
        try {
            // https://developer.apple.com/documentation/applemusicapi/get_multiple_catalog_songs_by_id
            const songsReq = await axios({
                method: 'get',
                baseURL: 'https://api.music.apple.com/',
                url: '/v1/catalog/us/songs',
                params: {
                    ids: chunk
                },
                headers: {
                    Authorization: ' Bearer ' + appleMusicKitDevToken,
                    // 'Music-User-Token': accessToken
                }
            });
            const data = songsReq.data;
            allData.push(data);
        } catch (_) {
            // https://developer.apple.com/documentation/applemusicapi/error  
            // report error properly here 
            throw Error("There was an issue getting your music from Apple Music.");
        }
    }
    return allData;
}