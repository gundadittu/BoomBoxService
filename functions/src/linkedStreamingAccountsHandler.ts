import * as functions from 'firebase-functions';
import { firestoreClient } from './index';
// import { LinkedStreamingAccount, LinkedStreamingAccountType } from '../models/LinkedStreamingAccount';
import { LinkedStreamingAccountCollectionKey } from './constants/firestoreConstants';
import { fetchAppleMusicUserLibrarySongs } from './streaming/appleMusic';
import { checkForAppleMusicLibrarySongsInIsrcStore } from './isrcStoreManager';

import {
    // AppleMusicLibrarySongsResponse,
    // validateAppleMusicLibrarySongResponse,
    AppleMusicLibrarySong,
    // validateAppleMusicLibrarySong,
    // AppleMusicLibrarySongAttributes,
    // validateAppleMusicLibrarySongAttributes,
    // AppleMusicLibrarySongAttributesArtwork, 
    // validateAppleMusicLibrarySongAttributesArtwork, 
    // AppleMusicLibrarySongAttributesPlayParams, 
    // validateAppleMusicLibrarySongAttributesPlayParams
} from './appleMusicTypeValidator';

type LinkedStreamingAccountType = "appleMusic" | "spotify";
function validateLinkedStreamingAccountType(arg: LinkedStreamingAccountType | any): arg is LinkedStreamingAccountType {
    if (arg == null || arg == undefined || typeof arg !== "string") {
        return false;
    }
    const possibleTypeValues = ["appleMusic", "spotify"];
    return possibleTypeValues.includes(arg);
}

// Added to address this issue: https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };

// TODO: configure for spotify set up 
export const setLinkedStreamingAccountForUser = functions.https.onCall(async (data, context) => {
    const auth = context.auth;
    var userUid = auth?.uid || null;
    let type = data.type || null;
    const appleMusicAccessToken = data.appleMusicAccessToken || null;
    // TODO: const spotifyAccessToken: String = data.spotifyAccessToken || null; // extract spotify credentials 

    if (userUid == null || type == null || (appleMusicAccessToken == null /* && spotifyAccessToken == null */)) {
        // TODO: throw error for missing parameters  
        return

        // TODO: add type check for spotify credentials 
    } else if (typeof userUid !== "string" || !validateLinkedStreamingAccountType(type) || typeof appleMusicAccessToken !== 'string') {
        // TODO: throw error for wrong type parameters 
        return

        // TODO: add check for spotify type and spotify credentials 
    } else if ((type == "appleMusic" && appleMusicAccessToken == null)) {
        // TODO: throw and report error 
        return
    }

    const newLinkedStreamingAccountData = {
        type: type,
        appleMusicAccessToken: appleMusicAccessToken,
        // TODO: add spotify credentials here 
    };

    // TODO: save old data to revert to if there is an error adding the new streaming account 
    const usersLinkedStreamingAccountRef = firestoreClient.collection(LinkedStreamingAccountCollectionKey).doc(userUid);
    await usersLinkedStreamingAccountRef.set(newLinkedStreamingAccountData);

    if (type == "appleMusic") {
        const allLibrarySongs: Array<AppleMusicLibrarySong> = await fetchAppleMusicUserLibrarySongs(appleMusicAccessToken);
        var isrcStoreCheck: [Array<AppleMusicLibrarySong>, Array<String>, Array<AppleMusicLibrarySong>] = await checkForAppleMusicLibrarySongsInIsrcStore(allLibrarySongs);
        const existingAppleMusicLibrarySongs: Array<AppleMusicLibrarySong> = isrcStoreCheck[0];
        const missingAppleMusicLibrarySongs: Array<AppleMusicLibrarySong> = isrcStoreCheck[1];

        // trigger function that stores missing songs in IsrcStore and get spotify data for them

        // stores users library songs + isrc codes in db
        // ??: put json file into cloudstorage + store reference as field in newLinkedStreamingAccountData
    } else if (type == "spotify") {
        // TODO: implement 
        return
    }
    return
});

// Relevant Docs: 
// - https://firebase.google.com/docs/reference/functions/providers_firestore_.documentbuilder.html#on-write
// export const triggerLinkedStreamingAccountLibraryUpdate = functions.firestore.document(LinkedStreamingAccountCollectionKey + '/{userUID').onWrite((change, context) => { 
//     const oldData = change.before.data();
//     const newData = change.after.data(); 

//     const eventType = context.eventType; 

//     // Nothing to update
//     if (eventType == "google.firestore.document.delete" || newData == null) { 
//         return 
//     }

//     if (newData.type == "appleMusic") { 

//     } else if (newData.type == "spotify") { 
//        // TODO  
//         return 
//     }

// });