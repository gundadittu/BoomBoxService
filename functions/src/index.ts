// "use strict";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as serviceAccount from './credentials/serviceAccountKey.json';

import * as Sentry from '@sentry/node';

import { setUserStreamingAccount } from './handlers/setUserStreamingAccount';
import { fetchExistingStreamingAccountItem } from './handlers/fetchExistingStreamingAccountItem';
import { triggerUserStreamingLibraryUpdate } from './handlers/triggerUserStreamingLibraryUpdate';

// https://firebase.google.com/docs/reference/admin/node?authuser=0
// https://firebase.google.com/docs/reference/functions?authuser=0



// Relevant docs: 
// - https://firebase.google.com/docs/admin/setup
// - admin sdk reference: https://firebase.google.com/docs/reference/admin
// - admin.firestore() reference: https://googleapis.dev/nodejs/firestore/latest/Firestore.html
// -  https://firebase.google.com/docs/reference/admin/node/admin.firestore
// - https://firebase.google.com/docs/reference/node/firebase.firestore?authuser=0
// - https://firebase.google.com/docs/reference/node/firebase.firestore.Firestore?authuser=0
const params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url,
}

admin.initializeApp({
    credential: admin.credential.cert(params),
    projectId: "boombox-2b90e",
});

export class Firebase {
    static adminClient = admin
    static firestoreClient = admin.firestore();
}

Sentry.init({
    dsn: "https://1742bd3e3ac34305a06fedf819ed36a5@o493644.ingest.sentry.io/5569089",

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

export class LogManager {
    static info = (message: string, obj: Object) => {
        ErrorManager.setContext(message, obj);
        functions.logger.log(message, obj);
    }
    static error = (message: string, obj: Object) => {
        functions.logger.error(message, obj);
    }
}

export class ErrorManager {
    static setContext = (message: string, data: Object) => {
        Sentry.setContext(message, data);
    }

    static reportErrorAndSetContext = (error: Error | Sentry.Exception, name: string, data: Object) => {
        // if (process.env.DEV_MODE == "development") {
        //     console.error(error);
        //     return
        // }
        Sentry.setContext(name || "data", data);
        Sentry.captureException(error);
    }

    static reportErrorOnly = (error: Error | Sentry.Exception) => {
        // if (process.env.DEV_MODE == "development") {
        //     console.error(error);
        //     return
        // }
        Sentry.captureException(error);
    }
}

exports.setUserStreamingAccount = setUserStreamingAccount;
exports.fetchExistingStreamingAccountItem = fetchExistingStreamingAccountItem; 
exports.triggerUserStreamingLibraryUpdate = triggerUserStreamingLibraryUpdate; 

// exports.setLinkedStreamingAccountForUser = setLinkedStreamingAccountForUser
// exports.fetchAppleMusicUserLibrarySongs = functions.https.onCall(async (data, _) => {
//     return AppleMusicAPI.fetchUserLibrarySongs(data.accessToken);
// }); 
// exports.fetchAppleMusicCatalogDataForSongs = functions.https.onCall(async (data, _) => {
//     return AppleMusicAPI.fetchCatalogDataForSongs(data.catalogIds);
// }); 