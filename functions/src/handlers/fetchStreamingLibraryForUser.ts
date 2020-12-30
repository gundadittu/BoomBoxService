import * as functions from 'firebase-functions';
import { ErrorManager, LogManager } from '../index';
import { UserStreamingLibraryStoreManager } from '../userStreamingLibraryStore/userStreamingLibraryStoreManager';
import { UserStreamingLibraryStoreItem, validateUserStreamingLibraryStoreItem } from '../userStreamingLibraryStore/userStreamingLibraryStoreTypes';


export const fetchStreamingLibraryForUser = functions.https.onCall(async (data, context) => {
    LogManager.info("fetchStreamingLibraryForUser() inputs", { data: data, context: { auth: { uid: context.auth?.uid } } });
    const userUid = context.auth?.uid;
    if (userUid == undefined) {
        throw new functions.https.HttpsError("unauthenticated", "Must be authenticated.");
    }

    const libraryStoreItem: UserStreamingLibraryStoreItem | null = await UserStreamingLibraryStoreManager.fetchLibraryStoreItemForUser(userUid);
    if (!libraryStoreItem) {
        return JSON.stringify(null);
    } else if (validateUserStreamingLibraryStoreItem(libraryStoreItem)) {
        return JSON.stringify(libraryStoreItem);
    } else { 
        let e = Error("Improperly formatted user streaming library store item found in db.");
        ErrorManager.reportErrorAndSetContext(e,"user streaming library store item", libraryStoreItem);
        throw e; 
    }
});

