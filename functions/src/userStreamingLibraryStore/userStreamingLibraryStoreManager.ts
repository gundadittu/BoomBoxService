import { IsrcStoreItem } from "../isrcStore/isrcStoreTypes";
import { Firebase, ErrorManager, Logger } from '../index';
import {validateUserStreamingLibraryStoreItem, UserStreamingLibraryStoreItem  } from './userStreamingLibraryStoreTypes';
import * as firestoreConstants from '../constants/firestoreConstants';

export class UserStreamingLibraryStoreManager {
    static storeAppleMusicLibraryForUser = async (userUid: string, libraryIsrcStoreItems: Array<IsrcStoreItem>): Promise<UserStreamingLibraryStoreItem> => {
        Logger.info("Provided input params:", { userUid: userUid, libraryIsrcStoreItems: libraryIsrcStoreItems });
 
        const isrcCodes = libraryIsrcStoreItems.map(isrcStoreItem => isrcStoreItem.isrcId);
        const libraryStoreItem = {
            isrcCodesForSongs: isrcCodes
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
}