import axios, { AxiosRequestConfig } from 'axios';
import { ErrorManager, LogManager } from '../index';
import {
    SpotifySavedTrack,
    validateSpotifySavedTrack,
} from './spotifyTypes';

export class SpotifyAPI {
    static fetchUserLibrarySongs = async (accessToken: String): Promise<Array<SpotifySavedTrack>> => {
        var allRawResponseItems: Array<Object> = [];
        try {
            var urlPath: string | null = '/v1/me/tracks';
            while (urlPath !== null && urlPath !== undefined) {
                let librarySongsReqConfig: AxiosRequestConfig = {
                    method: 'get',
                    baseURL: 'https://api.spotify.com/',
                    url: urlPath,
                    params: {
                        limit: 50,
                    },
                    headers: {
                        Authorization: ' Bearer ' + accessToken,
                    },
                };
                LogManager.info("Library song request config", librarySongsReqConfig);
                let librarySongsReq = await axios(librarySongsReqConfig);

                const jsonResponse = librarySongsReq.data;
                const response = JSON.parse(JSON.stringify(jsonResponse));
                let responseValidation = response !== null || response !== undefined
                if (!responseValidation) {
                    const errorMessage = "Spotify API returned null/undefined response:";
                    const e = Error(errorMessage);
                    ErrorManager.reportErrorAndSetContext(e, "api response", response);
                    throw e;
                }

                console.log(response);

                // Update for next while iteration
                urlPath = response.next || null;

                const responseItems = response.items;
                let responseItemsValidation = responseItems !== null && responseItems !== undefined
                if (!responseItemsValidation) {
                    const errorMessage = "Spotify API returned null/undefined response data body:";
                    const error = Error(errorMessage);
                    ErrorManager.reportErrorAndSetContext(error, "api response", response);
                    continue
                }
                allRawResponseItems.push(...responseItems);
            }
        } catch (e) {
            ErrorManager.reportErrorOnly(e);
            throw e;
        }
        var allSongs: Array<SpotifySavedTrack> = [];
        // Validate all song objects from API response
        for (var i = 0; i < allRawResponseItems.length; i++) {
            const currSavedTrack = allRawResponseItems[i];
            if (validateSpotifySavedTrack(currSavedTrack)) {
                allSongs.push(currSavedTrack);
            } else {
                const errorMessage = "validateSpotifySavedTrack failed for:";
                let e = Error(errorMessage);
                ErrorManager.reportErrorAndSetContext(e, "library song data", currSavedTrack);
            }
        }
        LogManager.info("SpotifyAPI.fetchUserLibrarySongs() output:", { allSongs: allSongs });
        return allSongs;
    }
}