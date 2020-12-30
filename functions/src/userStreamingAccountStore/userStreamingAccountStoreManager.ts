
import { Firebase, ErrorManager, LogManager } from '../index';
import { UserStreamingAccountStoreItem, validateUserStreamingAccountStoreItem } from "./userStreamingAccountStoreTypes";
import * as firestoreConstants from '../constants/firestoreConstants';

export class UserStreamingAccountStoreManager {
    static storeAppleMusicAccountForUser = async (userUid: string, accessToken: string): Promise<UserStreamingAccountStoreItem> => {
        LogManager.info("Provided input params:", { userUid: userUid, accessToken: accessToken });
        const data = {
            userUid: userUid,
            accountType: "appleMusic",
            appleMusicAccessToken: accessToken,
        };

        const accountItem = await UserStreamingAccountStoreManager.validateAndInsertIntoDB(userUid, data);
        return accountItem;
    }

    static storeSpotifyAccountForUser = async (userUid: string, accessToken: string): Promise<UserStreamingAccountStoreItem> => {
        LogManager.info("Provided input params:", { userUid: userUid, accessToken: accessToken });
        const data = {
            userUid: userUid,
            accountType: "spotify",
            spotifyAccessToken: accessToken,
        };

        const accountItem = await UserStreamingAccountStoreManager.validateAndInsertIntoDB(userUid, data);
        return accountItem;
    }

    static validateAndInsertIntoDB = async (userUid: string, data: UserStreamingAccountStoreItem | any): Promise<UserStreamingAccountStoreItem> => { 
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

    static fetchExistingStreamingAccount = async (userUid: string): Promise<UserStreamingAccountStoreItem | null> => {
        const usersLinkedStreamingAccountRef = Firebase.firestoreClient.collection(firestoreConstants.UserStreamingAccountStoreCollectionKey).doc(userUid);
        const response = await usersLinkedStreamingAccountRef.get();
        if (response.exists) {
            const data = response.data();
            if (validateUserStreamingAccountStoreItem(data)) {
                return data;
            }
        }
        return null;
    }
}