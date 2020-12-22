// "use strict";
import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import * as serviceAccount from './credentials/serviceAccountKey.json';

// import { setLinkedStreamingAccountForUser } from './functionHandlers/linkedStreamingAccountsHandler';
import { AppleMusicAPI } from './appleMusic/appleMusicAPI';

// https://firebase.google.com/docs/reference/admin/node?authuser=0
// https://firebase.google.com/docs/reference/functions?authuser=0


// Relevant docs: 
// - https://firebase.google.com/docs/admin/setup
// - admin sdk reference: https://firebase.google.com/docs/reference/admin
// - admin.firestore() reference: https://googleapis.dev/nodejs/firestore/latest/Firestore.html

// const params = {               
//     type: serviceAccount.type,
//     projectId: serviceAccount.project_id,
//     privateKeyId: serviceAccount.private_key_id,
//     privateKey: serviceAccount.private_key,
//     clientEmail: serviceAccount.client_email,
//     clientId: serviceAccount.client_id,
//     authUri: serviceAccount.auth_uri,
//     tokenUri: serviceAccount.token_uri,
//     authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
//     clientC509CertUrl: serviceAccount.client_x509_cert_url
// }

// admin.initializeApp({
//     credential: admin.credential.cert(params)
// });

// export var adminClient = admin;
// export var firestoreClient = admin.firestore();

// Relevant docs:
// -  https://firebase.google.com/docs/reference/admin/node/admin.firestore
// - https://firebase.google.com/docs/reference/node/firebase.firestore?authuser=0
// - https://firebase.google.com/docs/reference/node/firebase.firestore.Firestore?authuser=0

// Sentry.init({ dsn: generalCredentials["sentry"]["dsn"] });


// exports.setLinkedStreamingAccountForUser = setLinkedStreamingAccountForUser

exports.fetchAppleMusicUserLibrarySongs = functions.https.onCall(async (data, _) => {
    return AppleMusicAPI.fetchUserLibrarySongs(data.accessToken);
}); 

exports.fetchAppleMusicCatalogDataForSongs = functions.https.onCall(async (data, _) => {
    return AppleMusicAPI.fetchCatalogDataForSongs(data.catalogIds);
}); 