import * as functions from 'firebase-functions';
import { AppleMusicAPI } from '../appleMusic/appleMusicAPI';
import { SpotifyAPI } from '../spotify/spotifyAPI';

import { IsrcStoreManager } from '../isrcStore/isrcStoreManager';
import { LogManager } from '../index';
import {
    AppleMusicLibrarySong,
    AppleMusicCatalogSong,
} from '../appleMusic/appleMusicTypes';
import {
    SpotifySavedTrack,
} from '../spotify/spotifyTypes';
// import { UserStreamingAccountStoreManager } from '../userStreamingAccountStore/userStreamingAccountStoreManager';
import { UserStreamingLibraryStoreManager } from '../userStreamingLibraryStore/userStreamingLibraryStoreManager';
import * as firestoreConstants from '../constants/firestoreConstants';

// Relevant Docs: 
// - https://firebase.google.com/docs/reference/functions/providers_firestore_.documentbuilder.html#on-write
export const triggerUserStreamingLibraryUpdate = functions.runWith({
    timeoutSeconds: 540,
    memory: '2GB',
}).firestore.document(firestoreConstants.UserStreamingAccountStoreCollectionKey + '/{userUid}').onWrite(async (change, context) => {
    const oldData = change.before.data();
    const newData = change.after.data();
    const eventType = context.eventType;
    LogManager.info("triggerUserStreamingLibraryUpdate() inputs", { oldData: oldData, newData: newData, eventType: eventType });

    // Nothing to update
    if (eventType === "google.firestore.document.delete" || newData === undefined) {
        return;
    }

    const userUid = newData.userUid;
    if (userUid === null) {
        return;
    }
    const accountType = newData.accountType;
    const appleMusicAccessToken = newData.appleMusicAccessToken;
    const spotifyAccessToken = newData.spotifyAccessToken;
    if (accountType === "appleMusic" && appleMusicAccessToken != null) {
        const allLibrarySongs: Array<AppleMusicLibrarySong> = await AppleMusicAPI.fetchUserLibrarySongs(appleMusicAccessToken);
        LogManager.info("Got all apple music library songs for user:", { userUid: userUid, allLibrarySongs: allLibrarySongs });

        var catalogIds: Array<string> = allLibrarySongs.map((libSong: AppleMusicLibrarySong) => libSong.attributes.playParams.catalogId);
        // --> We throw out any user library songs that don't have a catalog id

        const appleMusicCatalogSongs: Array<AppleMusicCatalogSong> = await AppleMusicAPI.fetchCatalogDataForSongs(catalogIds);
        // ---> Fetch Apple Music Catalog data for User's Library Songs (allows us to access isrc code)

        LogManager.info("Got all apple music catalog data for user:", { userUid: userUid, appleMusicCatalogSongs: appleMusicCatalogSongs });
        // Store "missing" library songs into global Isrc Store 
        await IsrcStoreManager.storeMissingAppleMusicCatalogSongsIntoIsrcStore(appleMusicCatalogSongs);

        // Store User's library song list
        const librarySongsIsrcList = appleMusicCatalogSongs.map(currSong => currSong.attributes.isrc);
        // TODO: create a function in isrcstoremanager that convers appleMusic catalog songs into isrc store item
        await UserStreamingLibraryStoreManager.storeLibraryForUser(userUid, librarySongsIsrcList);
    } else if (accountType === "spotify" && spotifyAccessToken != null) {
        const allSavedTracks: Array<SpotifySavedTrack> = await SpotifyAPI.fetchUserLibrarySongs(spotifyAccessToken);
        // Store "missing" library songs into global Isrc Store 
        const allTracks = allSavedTracks.map(savedTrack => savedTrack.track);
        LogManager.info("Got all spotify tracks for user:", { userUid: userUid, allTracks: allTracks });
        await IsrcStoreManager.storeMissingSpotifyTracksIntoIsrcStore(allTracks);

        // Store User's library song list
        const librarySongsIsrcList = allTracks.map(currTrack => currTrack.external_ids.isrc);
        await UserStreamingLibraryStoreManager.storeLibraryForUser(userUid, librarySongsIsrcList);
    }
    return;
});