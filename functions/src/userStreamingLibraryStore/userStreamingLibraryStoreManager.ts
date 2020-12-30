import { Firebase, ErrorManager, LogManager } from '../index';
import { validateUserStreamingLibraryStoreItem, UserStreamingLibraryStoreItem } from './userStreamingLibraryStoreTypes';
import * as firestoreConstants from '../constants/firestoreConstants';
import { IsrcStoreItem } from '../isrcStore/isrcStoreTypes';

export class UserStreamingLibraryStoreManager {
    static storeLibraryForUser = async (userUid: string, isrcStoreItems: Array<IsrcStoreItem>): Promise<UserStreamingLibraryStoreItem> => {
        LogManager.info("UserStreamingLibraryStoreManager.storeLibraryForUser(): Provided input params:", { userUid: userUid, isrcStoreItems: isrcStoreItems });

        const libraryStoreItem: UserStreamingLibraryStoreItem = {
            userUid: userUid,
            librarySongs: isrcStoreItems,
        }

        if (!validateUserStreamingLibraryStoreItem(libraryStoreItem)) {
            const errorMessage = "validateUserStreamingAccountStoreItem failed for:";
            let e = Error(errorMessage);
            ErrorManager.reportErrorAndSetContext(e, "UserStreamingAccountStoreItem", libraryStoreItem);
            throw e;
        } else {
            // Insert into database 
            const usersLinkedStreamingLibraryRef = Firebase.firestoreClient.collection(firestoreConstants.UserStreamingLibraryStoreCollectionKey).doc(userUid);
            await usersLinkedStreamingLibraryRef.set(libraryStoreItem); 
            return libraryStoreItem;
        }
    }

    static fetchLibraryStoreItemForUser = async (userUid: string): Promise<UserStreamingLibraryStoreItem | null> => {
        LogManager.info("UserStreamingLibraryStoreManager.fetchLibraryForUser(): Provided input params:", { userUid: userUid });
        const usersLinkedStreamingLibraryRef = Firebase.firestoreClient.collection(firestoreConstants.UserStreamingLibraryStoreCollectionKey).doc(userUid);
        const libraryDoc = await usersLinkedStreamingLibraryRef.get();

        if (!libraryDoc.exists) {
            let e = Error("Missing User Library");
            ErrorManager.reportErrorAndSetContext(e, "userUid", userUid);
            LogManager.info("UserStreamingLibraryStoreManager.fetchLibraryForUser() is returning null due to no data found in db.", { userUid: userUid });
            return null;
        }

        const data = libraryDoc.data();
        if (validateUserStreamingLibraryStoreItem(data)) {
            LogManager.info("UserStreamingLibraryStoreManager.fetchLibraryForUser() output:", data);
            return data;
        } else {
            let e = Error("Improperly formatted UserStreamingLibraryStoreItem found in db");
            ErrorManager.reportErrorAndSetContext(e, "library data", JSON.stringify(data));
            LogManager.info("Improperly formatted UserStreamingLibraryStoreItem found in db. Returning null.", { userUid: userUid });
            return null;
        }

    }
}