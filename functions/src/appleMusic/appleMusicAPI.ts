
import axios, { AxiosRequestConfig } from 'axios';
import {
    validateAppleMusicLibrarySong,
    AppleMusicLibrarySong,
    validateAppleMusicCatalogSong,
    AppleMusicCatalogSong,
    DisabledAppleMusicCatalogSong,
    validateDisabledAppleMusicCatalogSong,
} from './appleMusicTypes';
import { ErrorManager, LogManager } from '../index';

/* Apple Music API Relevant Docs/Tutorials: 
    - https://developer.apple.com/documentation/applemusicapi/
    - https://crunchybagel.com/integrating-apple-music-into-your-ios-app/
*/
// Other Relevent Docs: 
// https://www.npmjs.com/package/axios
// https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index

export class AppleMusicAPI {
    // TODO: store credential in a secure way
    static musicKitDevToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikg5N1gyNDRXRzQifQ.eyJpc3MiOiJKUTRLOEVFNzdQIiwiaWF0IjoxNjA4NDAwODA3LCJleHAiOjE2MjIzMDc2MDd9.vNFIr68DREmo6TpIpjExAnsXD8fLW0fW_QdWUPxuGTloKCrSIsBXzmIRCoaoAzRNPhkTi258l-pKg5VmCFqNbw";
    // const accessToken = "AiMnP2f9jea8Opt5Sr48si3I+ehObpOr00LpEWzblEAWg/oxSgl1j/rxDynzl9frFrQAf0v+OlDGQEDwqJCv2xriCwmnuNxKkPu+9OY8fjHMGnUMMOD5BQDx2AXN58f+PAnPLxSnwzhAYLZAOSzUm9i+tSTHx+gNIOzStvkNERUHHbj7lB3S8MkeB7rhYPjPSNDpaE0qBlYbsXL4tM89EhmTmgT908OjSCuKyy0EGpQBkQ4dsA==";

    // Docs: https://developer.apple.com/documentation/applemusicapi/songs
    static fetchUserLibrarySongs = async (accessToken: String): Promise<Array<AppleMusicLibrarySong>> => {
        LogManager.info("AppleMusicAPI.fetchUserLibrarySongs() inputs:", { accessToken: accessToken });

        var allRawResponseData: Array<Object> = [];
        try {
            var urlPath: string | null = '/v1/me/library/songs';
            while (urlPath !== null && urlPath !== undefined) {
                let librarySongsReqConfig: AxiosRequestConfig = {
                    method: 'get',
                    baseURL: 'https://api.music.apple.com/',
                    url: urlPath,
                    params: {
                        limit: 100,
                        include: ['catalog'],
                    },
                    headers: {
                        Authorization: ' Bearer ' + AppleMusicAPI.musicKitDevToken,
                        'Music-User-Token': accessToken,
                    },
                };
                LogManager.info("Library song request config", librarySongsReqConfig); 
                let librarySongsReq = await axios(librarySongsReqConfig);

                let jsonResponse = librarySongsReq.data;
                // Below line added to address this bug: https://github.com/microsoft/TypeScript/issues/35546
                let response = JSON.parse(JSON.stringify(jsonResponse));
                let responseValidation = response !== null || response !== undefined
                if (!responseValidation) {
                    const errorMessage = "Apple Music API returned null/undefined response:";
                    const e = Error(errorMessage);
                    ErrorManager.reportErrorAndSetContext(e, "api response", response);
                    throw e; 
                }

                // Update for next while iteration
                urlPath = response.next || null;

                const responseData = response.data;
                let responseDataValidation = responseData !== null && responseData !== undefined
                if (!responseDataValidation) {
                    const errorMessage = "Apple Music Library Songs API returned null/undefined response data body:";
                    const error = Error(errorMessage);
                    ErrorManager.reportErrorAndSetContext(error, "api response", response);
                    continue
                }
                allRawResponseData.push(...responseData);
            }
        } catch (error) {
            // Apple Music API Error Docs: https://developer.apple.com/documentation/applemusicapi/error  
            ErrorManager.reportErrorOnly(error);
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
                const errorMessage = "validateAppleMusicLibrarySong failed for:";
                let e = Error(errorMessage);
                ErrorManager.reportErrorAndSetContext(e, "library song data", currData);
            }
        }
        LogManager.info("AppleMusicAPI.fetchUserLibrarySongs() output:", {allSongs: allSongs});
        return allSongs;
    }

    // Docs: https://developer.apple.com/documentation/applemusicapi/get_multiple_catalog_songs_by_id
    static fetchCatalogDataForSongs = async (catalogIds: Array<string>): Promise<Array<AppleMusicCatalogSong | DisabledAppleMusicCatalogSong>> => {
        LogManager.info("AppleMusicAPI.fetchCatalogDataForSongs() inputs:", { catalogIds: catalogIds });
        
        // Need to split ids into chunks of 250 (API has a max of 300 ids per request)
        const splitCatalogIds = (): Array<Array<string>> => {
            if (catalogIds == null) {
                return [];
            }
            var allChunks: Array<Array<string>> = [];
            let chunkSize = 300;
            var ind, j;
            for (ind = 0, j = catalogIds.length ; ind < j; ind += chunkSize) {
                const temp: Array<string> = catalogIds.slice(ind, ind + chunkSize);
                allChunks.push(temp);
            }
            return allChunks;
        }

        var idChunks: Array<Array<string>> = splitCatalogIds();
        var allRawResponseData: Array<Object> = [];
        try {
            for (const idChunk of idChunks) {
                const idChunkString = idChunk.join(",");
                // https://developer.apple.com/documentation/applemusicapi/get_multiple_catalog_songs_by_id
                let songReqConfig: AxiosRequestConfig = {
                    method: 'get',
                    baseURL: 'https://api.music.apple.com/',
                    url: '/v1/catalog/us/songs',
                    params: {
                        ids: idChunkString,
                    },
                    headers: {
                        Authorization: ' Bearer ' + AppleMusicAPI.musicKitDevToken,
                    },
                };
                LogManager.info("Catalog song request config", songReqConfig); 
                let songsReq = await axios(songReqConfig);

                let response = songsReq.data;
                let responseValidation = response !== null || response !== undefined
                if (!responseValidation) {
                    const errorMessage = "Apple Music API returned null/undefined response.";
                    let e = Error(errorMessage);
                    ErrorManager.reportErrorAndSetContext(e, "api response", response);
                    throw e;
                }

                const responseData = response.data;
                let responseDataValidation = responseData !== null && responseData !== undefined
                if (!responseDataValidation) {
                    const errorMessage = "Apple Music Catalog Songs API returned null/undefined response data body:";
                    const error = Error(errorMessage);
                    ErrorManager.reportErrorAndSetContext(error, "api response", response);
                    continue
                }
                allRawResponseData.push(...responseData);
            }
        } catch (e) {
            // Apple Music API Error Docs: https://developer.apple.com/documentation/applemusicapi/error  
            ErrorManager.reportErrorOnly(e);
            throw e;
        }

        var allSongs: Array<AppleMusicCatalogSong | DisabledAppleMusicCatalogSong> = [];
        for (var i = 0; i < allRawResponseData.length; i++) {
            console.log("validateAppleMusicCatalogSong started for item at index " + i);
            const currData = allRawResponseData[i];
            if (validateAppleMusicCatalogSong(currData)) {
                allSongs.push(currData);
            } else if (validateDisabledAppleMusicCatalogSong(currData)) {
                allSongs.push(currData);
            } else {
                const errorMessage = "validateAppleMusicCatalogSong failed for:";
                let e = Error(errorMessage);
                ErrorManager.reportErrorAndSetContext(e, "catalog song data", currData);
                continue
            }
        }

        LogManager.info("AppleMusicAPI.fetchCatalogDataForSongs() output:", allSongs);
        return allSongs;
    }
}