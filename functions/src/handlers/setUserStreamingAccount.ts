import * as functions from 'firebase-functions';
// import { AppleMusicAPI } from '../appleMusic/appleMusicAPI';
// import { IsrcStoreManager } from '../isrcStore/isrcStoreManager';
import { ErrorManager, LogManager } from '../index';
// import {
//     AppleMusicLibrarySong,
//     AppleMusicCatalogSong,
//     DisabledAppleMusicCatalogSong,
// } from '../appleMusic/appleMusicTypes';
// import { IsrcStoreItem } from '../isrcStore/isrcStoreTypes';
import { UserStreamingAccountStoreManager } from '../userStreamingAccountStore/userStreamingAccountStoreManager';
// import { UserStreamingLibraryStoreManager } from '../userStreamingLibraryStore/userStreamingLibraryStoreManager';
// import * as firestoreConstants from '../constants/firestoreConstants';

// Added to address this issue: https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };

// Type Validators 
export type LinkedStreamingAccountType = "appleMusic" | "spotify";
function validateLinkedStreamingAccountType(arg: LinkedStreamingAccountType | any): arg is LinkedStreamingAccountType {
    if (arg === null || arg === undefined || typeof arg != "string") {
        return false;
    }
    const possibleTypeValues = ["appleMusic", "spotify"];
    return possibleTypeValues.includes(arg);
}

// TODO: configure for spotify set up 
export const setUserStreamingAccount = functions.https.onCall(async (data, context) => {
    LogManager.info("setUserStreamingAccount() inputs", { data: data, context: { auth: { uid: context.auth?.uid}} });
    const auth = context.auth;
    const userUid = auth?.uid || null;
    const rawAccountType = data.accountType || null;
    const appleMusicAccessToken = data.appleMusicAccessToken || null;
    // TODO: const spotifyAccessToken: String = data.spotifyAccessToken || null; // extract spotify credentials 

    // TODO: compare existing and old credentials to make sure we are not doing duplicate work --> may not be needed? based on how often FE will send this requets?

    if (userUid === null || rawAccountType === null || (appleMusicAccessToken === null /* && spotifyAccessToken === null */)) {
        const errorMessage = "Missing authentication and/or required parameters.";
        let e = Error(errorMessage);
        ErrorManager.reportErrorAndSetContext(e, "params", data);
        throw new functions.https.HttpsError("invalid-argument", "Missing authentication or required parameters.");

        // TODO: add type check for spotify credentials 
    } else if (typeof userUid != "string" || !validateLinkedStreamingAccountType(rawAccountType) || typeof appleMusicAccessToken !== 'string') {
        const errorMessage = "Missing authentication and/or required parameters.";
        let e = Error(errorMessage);
        ErrorManager.reportErrorAndSetContext(e, "params", data);
        throw new functions.https.HttpsError("invalid-argument", "Must provide a valid type for userUid, appleMusicAccessToken, and accountType.");

        // TODO: add check for spotify type and spotify credentials 
    } else if ((rawAccountType === "appleMusic" && appleMusicAccessToken === null)) {
        const errorMessage = "Missing appleMusicAccessToken.";
        let e = Error(errorMessage);
        ErrorManager.reportErrorAndSetContext(e, "params", data);
        throw new functions.https.HttpsError("invalid-argument", "Must provide appleMusicAccess token for accountType=appleMusic.");
    }
    const type: LinkedStreamingAccountType = rawAccountType

    if (type === "appleMusic") {
        // Store user's credentials + library 
        const streamingAccount = await UserStreamingAccountStoreManager.storeAppleMusicAccountForUser(userUid, appleMusicAccessToken);
        return JSON.stringify(streamingAccount); 
    } else if (type === "spotify") {
        // TODO: implement 
        throw Error("Spotify support not implemented yet");
    }
    return JSON.stringify(null);
});