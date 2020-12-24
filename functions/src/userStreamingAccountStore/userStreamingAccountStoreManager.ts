
import { Firebase, ErrorManager, Logger } from '../index';
import { IsrcStoreItem } from "../isrcStore/isrcStoreTypes";
import { validateUserStreamingAccountStoreItem } from "./userStreamingAccountStoreTypes";
import * as firestoreConstants from '../constants/firestoreConstants';

export class UserStreamingAccountStoreManager {
    static addAppleMusicAccountForUser = async (userUid: string, accessToken: string, libraryIsrcStoreItems: Array<IsrcStoreItem>): Promise<void> => {
        Logger.info("Provided input params:", { userUid: userUid, accessToken: accessToken, libraryIsrcStoreItems: libraryIsrcStoreItems});
        const isrcCodes = libraryIsrcStoreItems.map(isrcStoreItem => isrcStoreItem.isrcId);
        const data = {
            userUid: userUid,
            accountType: "appleMusic",
            appleMusicAccessToken: accessToken,
            library: {
                isrcCodesForSongs: isrcCodes
            }
        };

        if (!validateUserStreamingAccountStoreItem(data)) {
            const errorMessage = "validateUserStreamingAccountStoreItem failed for:";
            let e = Error(errorMessage);
            ErrorManager.reportErrorAndSetContext(e, "UserStreamingAccountStoreItem", data);
            throw e;
        }

        // Insert into database 
        const usersLinkedStreamingAccountRef = Firebase.firestoreClient.collection(firestoreConstants.UserStreamingAccountStoreCollectionKey).doc(userUid);
        await usersLinkedStreamingAccountRef.set(data);
    }
}