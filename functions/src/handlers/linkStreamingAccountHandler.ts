import * as functions from 'firebase-functions';
import { AppleMusicAPI } from '../appleMusic/appleMusicAPI';
import { IsrcStoreManager } from '../isrcStore/isrcStoreManager';
import { ErrorManager, Logger } from '../index';
import {
    AppleMusicLibrarySong,
    AppleMusicCatalogSong,
    DisabledAppleMusicCatalogSong
} from '../appleMusic/appleMusicTypes';
import { IsrcStoreItem } from '../isrcStore/isrcStoreTypes';
import { UserStreamingAccountStoreManager } from '../userStreamingAccountStore/userStreamingAccountStoreManager';
import { UserStreamingLibraryStoreManager } from '../userStreamingLibraryStore/userStreamingLibraryStoreManager';
import * as firestoreConstants from '../constants/firestoreConstants';

// Added to address this issue: https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };

// Type Validators 
export type LinkedStreamingAccountType = "appleMusic" | "spotify";
function validateLinkedStreamingAccountType(arg: LinkedStreamingAccountType | any): arg is LinkedStreamingAccountType {
    if (arg == null || arg == undefined || typeof arg !== "string") {
        return false;
    }
    const possibleTypeValues = ["appleMusic", "spotify"];
    return possibleTypeValues.includes(arg);
}

// TODO: configure for spotify set up 
export const linkStreamingAccountForUser = functions.https.onCall(async (data, context) => {
    Logger.info("linkStreamingAccountForUser() inputs", { data: data, context: context });
    const auth = context.auth;
    const userUid = auth?.uid || null;
    const rawAccountType = data.accountType || null;
    const appleMusicAccessToken = data.appleMusicAccessToken || null;
    // TODO: const spotifyAccessToken: String = data.spotifyAccessToken || null; // extract spotify credentials 

    // TODO: compare existing and old credentials to make sure we are not doing duplicate work --> may not be needed? based on how often FE will send this requets?

    if (userUid == null || rawAccountType == null || (appleMusicAccessToken == null /* && spotifyAccessToken == null */)) {
        const errorMessage = "Missing authentication and/or required parameters.";
        let e = Error(errorMessage);
        ErrorManager.reportErrorAndSetContext(e, "params", data);
        throw new functions.https.HttpsError("invalid-argument", "Missing authentication or required parameters.");

        // TODO: add type check for spotify credentials 
    } else if (typeof userUid !== "string" || !validateLinkedStreamingAccountType(rawAccountType) || typeof appleMusicAccessToken !== 'string') {
        const errorMessage = "Missing authentication and/or required parameters.";
        let e = Error(errorMessage);
        ErrorManager.reportErrorAndSetContext(e, "params", data);
        throw new functions.https.HttpsError("invalid-argument", "Must provide a valid type for userUid, appleMusicAccessToken, and accountType.");

        // TODO: add check for spotify type and spotify credentials 
    } else if ((rawAccountType == "appleMusic" && appleMusicAccessToken == null)) {
        const errorMessage = "Missing appleMusicAccessToken.";
        let e = Error(errorMessage);
        ErrorManager.reportErrorAndSetContext(e, "params", data);
        throw new functions.https.HttpsError("invalid-argument", "Must provide appleMusicAccess token for accountType=appleMusic.");
    }
    const type: LinkedStreamingAccountType = rawAccountType

    if (type == "appleMusic") {
        // Store user's credentials + library 
        const streamingAccount = await UserStreamingAccountStoreManager.storeAppleMusicAccountForUser(userUid, appleMusicAccessToken);
        return streamingAccount
    } else if (type == "spotify") {
        // TODO: implement 
        throw Error("Spotify support not implemented yet");
    }
    return
});

// Relevant Docs: 
// - https://firebase.google.com/docs/reference/functions/providers_firestore_.documentbuilder.html#on-write
export const triggerLinkedStreamingAccountLibraryUpdate = functions.firestore.document(firestoreConstants.UserStreamingAccountStoreCollectionKey + '/{userUid}').onWrite(async (change, context) => {
    // const oldData = change.before.data();
    const newData = change.after.data();

    const eventType = context.eventType;

    // Nothing to update
    if (eventType == "google.firestore.document.delete" || newData == null) {
        return
    }

    // Library data already present 
    if (newData.library != null) {
        return
    }

    const userUid = newData.userUid;
    if (userUid == null) {
        return
    }

    const appleMusicAccessToken = newData.appleMusicAccessToken;
    if (newData.type == "appleMusic" && appleMusicAccessToken != null) {
        const allLibrarySongs: Array<AppleMusicLibrarySong> = await AppleMusicAPI.fetchUserLibrarySongs(appleMusicAccessToken);
        const catalogIds = allLibrarySongs.map((libSong: AppleMusicLibrarySong) => {
            return libSong.attributes.playParams.catalogId;
        });
        // Fetch Apple Music Catalog data for User's Library Songs (allows us to access isrc code)
        const appleMusicCatalogSongs: Array<AppleMusicCatalogSong | DisabledAppleMusicCatalogSong> = await AppleMusicAPI.fetchCatalogDataForSongs(catalogIds);
        // Store user's library songs into global Isrc Store 
        const isrcStoreItems: Array<IsrcStoreItem> = await IsrcStoreManager.storeAppleMusicCatalogSongsIntoIsrcStore(appleMusicCatalogSongs);

        await UserStreamingLibraryStoreManager.storeAppleMusicLibraryForUser(userUid, isrcStoreItems);
    } else if (newData.type == "spotify") {
        // TODO : implement 
        return
    }

});