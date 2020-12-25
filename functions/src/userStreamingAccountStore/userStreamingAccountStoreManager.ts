
import { Firebase, ErrorManager, Logger } from '../index';
import { UserStreamingAccountStoreItem, validateUserStreamingAccountStoreItem } from "./userStreamingAccountStoreTypes";
import * as firestoreConstants from '../constants/firestoreConstants';

export class UserStreamingAccountStoreManager {
    static storeAppleMusicAccountForUser = async (userUid: string, accessToken: string): Promise<UserStreamingAccountStoreItem> => {
        Logger.info("Provided input params:", { userUid: userUid, accessToken: accessToken });
        const data = {
            userUid: userUid,
            accountType: "appleMusic",
            appleMusicAccessToken: accessToken,
        };

        if (!validateUserStreamingAccountStoreItem(data)) {
            const errorMessage = "validateUserStreamingAccountStoreItem failed for:";
            let e = Error(errorMessage);
            ErrorManager.reportErrorAndSetContext(e, "UserStreamingAccountStoreItem", data);
            throw e;
        } else {
            // Insert into database 
            const usersLinkedStreamingAccountRef = Firebase.firestoreClient.collection(firestoreConstants.UserStreamingAccountStoreCollectionKey).doc(userUid);
            await usersLinkedStreamingAccountRef.set(data);
            return data;
        }
    }
}