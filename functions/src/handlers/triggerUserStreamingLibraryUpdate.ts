import * as functions from 'firebase-functions';
import { AppleMusicAPI } from '../appleMusic/appleMusicAPI';
import { IsrcStoreManager } from '../isrcStore/isrcStoreManager';
import { LogManager } from '../index';
import {
    AppleMusicLibrarySong,
    AppleMusicCatalogSong,
    DisabledAppleMusicCatalogSong,
} from '../appleMusic/appleMusicTypes';
import { IsrcStoreItem } from '../isrcStore/isrcStoreTypes';
// import { UserStreamingAccountStoreManager } from '../userStreamingAccountStore/userStreamingAccountStoreManager';
import { UserStreamingLibraryStoreManager } from '../userStreamingLibraryStore/userStreamingLibraryStoreManager';
import * as firestoreConstants from '../constants/firestoreConstants';

// Relevant Docs: 
// - https://firebase.google.com/docs/reference/functions/providers_firestore_.documentbuilder.html#on-write
export const triggerUserStreamingLibraryUpdate = functions.firestore.document(firestoreConstants.UserStreamingAccountStoreCollectionKey + '/{userUid}').onWrite(async (change, context) => {
    const oldData = change.before.data();
    const newData = change.after.data();
    const eventType = context.eventType;
    LogManager.info("triggerUserStreamingLibraryUpdate() inputs", { oldData:oldData, newData: newData,eventType: eventType });

    // Nothing to update
    if (eventType === "google.firestore.document.delete" || newData === undefined) {
        return
    }

    const userUid = newData.userUid;
    if (userUid === null) {
        return
    }
    const accountType = newData.accountType; 
    const appleMusicAccessToken = newData.appleMusicAccessToken;
    if (accountType === "appleMusic" && appleMusicAccessToken != null) {
        const allLibrarySongs: Array<AppleMusicLibrarySong> = await AppleMusicAPI.fetchUserLibrarySongs(appleMusicAccessToken);
        const catalogIds = allLibrarySongs.map((libSong: AppleMusicLibrarySong) => {
            return libSong.attributes.playParams.catalogId;
        });
        // Fetch Apple Music Catalog data for User's Library Songs (allows us to access isrc code)
        const appleMusicCatalogSongs: Array<AppleMusicCatalogSong | DisabledAppleMusicCatalogSong> = await AppleMusicAPI.fetchCatalogDataForSongs(catalogIds);
        // Store user's library songs into global Isrc Store 
        const isrcStoreItems: Array<IsrcStoreItem> = await IsrcStoreManager.storeAppleMusicCatalogSongsIntoIsrcStore(appleMusicCatalogSongs);

        await UserStreamingLibraryStoreManager.storeAppleMusicLibraryForUser(userUid, isrcStoreItems);
    } else if (newData.type === "spotify") {
        // TODO : implement 
        return
    }

});