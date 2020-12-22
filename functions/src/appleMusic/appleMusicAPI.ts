
// https://www.npmjs.com/package/axios
// https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
import axios from 'axios';
// import * as qs from 'qs';
import {
    // AppleMusicLibrarySongsResponse,
    validateAppleMusicLibrarySong,
    AppleMusicLibrarySong,
    validateAppleMusicCatalogSong,
    AppleMusicCatalogSong,
    // validateAppleMusicCatalogSongsResponse,
    // validateAppleMusicLibrarySong,
    // AppleMusicLibrarySongAttributes,
    // validateAppleMusicLibrarySongAttributes,
    // AppleMusicLibrarySongAttributesArtwork, 
    // validateAppleMusicLibrarySongAttributesArtwork, 
    // AppleMusicLibrarySongAttributesPlayParams, 
    // validateAppleMusicLibrarySongAttributesPlayParams
} from './appleMusicTypes';

/* Apple Music API Relevant Docs/Tutorials: 
    - https://developer.apple.com/documentation/applemusicapi/
    - https://crunchybagel.com/integrating-apple-music-into-your-ios-app/
*/
export class AppleMusicAPI {
    // TODO: store credential in a secure way
    static musicKitDevToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikg5N1gyNDRXRzQifQ.eyJpc3MiOiJKUTRLOEVFNzdQIiwiaWF0IjoxNjA4NDAwODA3LCJleHAiOjE2MjIzMDc2MDd9.vNFIr68DREmo6TpIpjExAnsXD8fLW0fW_QdWUPxuGTloKCrSIsBXzmIRCoaoAzRNPhkTi258l-pKg5VmCFqNbw";
    // const accessToken = "AiMnP2f9jea8Opt5Sr48si3I+ehObpOr00LpEWzblEAWg/oxSgl1j/rxDynzl9frFrQAf0v+OlDGQEDwqJCv2xriCwmnuNxKkPu+9OY8fjHMGnUMMOD5BQDx2AXN58f+PAnPLxSnwzhAYLZAOSzUm9i+tSTHx+gNIOzStvkNERUHHbj7lB3S8MkeB7rhYPjPSNDpaE0qBlYbsXL4tM89EhmTmgT908OjSCuKyy0EGpQBkQ4dsA==";

    // Docs: https://developer.apple.com/documentation/applemusicapi/songs
    static fetchUserLibrarySongs = async (accessToken: String): Promise<Array<AppleMusicLibrarySong>> => {
        var allRawResponseData: Array<Object> = [];
        try {
            var urlPath: string | null = '/v1/me/library/songs';
            while (urlPath != null && urlPath != undefined) {

                let librarySongsReq = await axios({
                    method: 'get',
                    baseURL: 'https://api.music.apple.com/',
                    url: urlPath,
                    params: {
                        limit: 100,
                        include: ['catalog']
                    },
                    headers: {
                        Authorization: ' Bearer ' + AppleMusicAPI.musicKitDevToken,
                        'Music-User-Token': accessToken
                    }
                });

                let jsonResponse = librarySongsReq.data;
                // Below line added to address this bug: https://github.com/microsoft/TypeScript/issues/35546
                let response = JSON.parse(JSON.stringify(jsonResponse));
                let responseValidation = response != null || response != undefined
                if (!responseValidation) {
                    // TODO: report this error and all relevant data + request logs 
                    throw Error("Apple Music API returned null/undefined response.");
                }

                // Update for next while iteration
                urlPath = response.next || null;

                const responseData = response.data;
                let responseDataValidation = responseData != null && responseData != undefined
                if (!responseDataValidation) {
                    // TODO: report this error and all relevant data + request logs 
                    continue
                }
                allRawResponseData.push(...responseData);
            }
        } catch (error) {
            // Apple Music API Error Docs: https://developer.apple.com/documentation/applemusicapi/error  
            // TODO: report error properly here 
            // throw Error("There was an issue getting your music from Apple Music.");
            throw error;
        }
        var allSongs: Array<AppleMusicLibrarySong> = [];
        // Validate all song objects from API response
        for (var i = 0; i < allRawResponseData.length; i++) {
            // console.log("validateAppleMusicLibrarySong started for item at index " + i);
            const currData = allRawResponseData[i];
            if (validateAppleMusicLibrarySong(currData)) {
                allSongs.push(currData);
            } else {
                console.error("validateAppleMusicLibrarySong failed for: " + JSON.stringify(currData));
                // TODO: log this error and include log details on what type validation failed + song data 
            }
        }
        return allSongs;
    }

    // Docs: https://developer.apple.com/documentation/applemusicapi/get_multiple_catalog_songs_by_id
    static fetchCatalogDataForSongs = async (catalogIds: Array<string>): Promise<Array<AppleMusicCatalogSong>> => {
        // Need to split ids into chunks of 250 (API has a max of 300 ids per request)
        const splitCatalogIds = (catalogIds: Array<string>): Array<Array<string>> => {
            if (catalogIds == null) {
                return [];
            }
            var allChunks: Array<Array<string>> = [];
            var i, j, chunkSize = 300;
            for (i = 0, j = catalogIds.length; i < j; i += chunkSize) {
                const temp: Array<string> = catalogIds.slice(i, i + chunkSize);
                allChunks.push(temp);
            }
            return allChunks;
        }

        var idChunks: Array<Array<string>> = splitCatalogIds(catalogIds);
        var allRawResponseData: Array<Object> = [];
        try {
            for (const idChunk of idChunks) {
                const idChunkString = idChunk.join(",");
                // https://developer.apple.com/documentation/applemusicapi/get_multiple_catalog_songs_by_id
                let songsReq = await axios({
                    method: 'get',
                    baseURL: 'https://api.music.apple.com/',
                    url: '/v1/catalog/us/songs',
                    params: {
                        ids: idChunkString
                    },
                    headers: {
                        Authorization: ' Bearer ' + AppleMusicAPI.musicKitDevToken,
                    }
                });

                // const jsonResponse = songsReq.data;
                // console.log(jsonResponse);
                let response = songsReq.data;
                let responseValidation = response != null || response != undefined
                if (!responseValidation) {
                    // TODO: report this error and all relevant data + request logs 
                    throw Error("Apple Music API returned null/undefined response.");
                }

                const responseData = response.data;
                let responseDataValidation = responseData != null && responseData != undefined
                if (!responseDataValidation) {
                    // TODO: report this error and all relevant data + request logs 
                    continue
                }
                allRawResponseData.push(...responseData);
            }
        } catch (error) {
            // Apple Music API Error Docs: https://developer.apple.com/documentation/applemusicapi/error  
            // TODO: report this error + better error message 
            // throw Error("There was an issue getting your music from Apple Music.");
            console.error(error);
            throw error;
        }

        var allSongs: Array<AppleMusicCatalogSong> = [];
        for (var i = 0; i < allRawResponseData.length; i++) {
            console.log("validateAppleMusicCatalogSong started for item at index " + i);
            const currData = allRawResponseData[i];
            if (validateAppleMusicCatalogSong(currData)) {
                allSongs.push(currData);
            } else {
                console.error("validateAppleMusicCatalogSong failed for: " + JSON.stringify(currData));
                // TODO: log this error and include log details on what type validation failed + song data 
            }
        }
        return allSongs;
    }
}