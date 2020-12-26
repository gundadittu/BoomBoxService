
import * as functions from 'firebase-functions';
import { LogManager } from '../index';
import { UserStreamingAccountStoreManager } from '../userStreamingAccountStore/userStreamingAccountStoreManager';

export const fetchExistingStreamingAccountItem = functions.https.onCall(async (data, context) => {
    LogManager.info("fetchExistingStreamingAccountItem() inputs", { data: data, context: { auth: { uid: context.auth?.uid}} });
    // if (context.auth == undefined) { 
    //     // https://firebase.google.com/docs/reference/functions/providers_https_.httpserror
    //     throw new functions.https.HttpsError("unauthenticated", "Must be authenticated.");
    // }
    const userUid = context.auth?.uid; 
    if (userUid == undefined) { 
        throw new functions.https.HttpsError("unauthenticated", "Must be authenticated.");
    }

    const userStreamingStoreItem = await UserStreamingAccountStoreManager.fetchExistingStreamingAccount(userUid); 
    return JSON.stringify(userStreamingStoreItem);
});
