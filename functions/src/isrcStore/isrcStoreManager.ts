import * as functions from 'firebase-functions';
import { firestoreClient } from '../index';
import { AppleMusicIsrcStoreCollectionKey } from '../constants/firestoreConstants';
import {
    // AppleMusicLibrarySongsResponse,
    // validateAppleMusicLibrarySongResponse,
    AppleMusicLibrarySong,
    // validateAppleMusicLibrarySong,
    AppleMusicLibrarySongAttributes,
    // validateAppleMusicLibrarySongAttributes,
    // AppleMusicLibrarySongAttributesArtwork, 
    // validateAppleMusicLibrarySongAttributesArtwork, 
    AppleMusicLibrarySongAttributesPlayParams,
    // validateAppleMusicLibrarySongAttributesPlayParams
} from './appleMusicTypeValidator';

// Added to address this issue: https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };

export class IsrcStoreManager { 
    static checkForAppleMusicLibrarySongs = async (librarySongs: Array<AppleMusicLibrarySong>): Promise<[Array<AppleMusicLibrarySong>, Array<String>, Array<String>]> => {
        // https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html
        const appleMusicIsrcStoreCollectionRef: CollectionReference = await firestoreClient.collection(AppleMusicIsrcStoreCollectionKey);
    
        var existingAppleMusicLibrarySongs: Array<AppleMusicLibrarySong> = [];
        var missingAppleMusicLibrarySongs: Array<AppleMusicLibrarySong> = [];
        var existingIsrcCodes: Array<String> = [];
        for (var i = 0; i < librarySongs.length; i++) {
            const song = librarySongs[i] as AppleMusicLibrarySong;
            const attributes = song.attributes as AppleMusicLibrarySongAttributes;
            const playParams = attributes.playParams as AppleMusicLibrarySongAttributesPlayParams;
            const catalogID = playParams.catalogId;
            // TODO: create this query index in firestore 
            // https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#where ; https://googleapis.dev/nodejs/firestore/latest/QuerySnapshot.html
            const catalogIDQuerySnapshot: QuerySnapshot  = await appleMusicIsrcStoreCollectionRef.where("appleMusicCatalogId", '==', catalogID).get();
            if (catalogIDQuerySnapshot.empty) {
                missingAppleMusicLibrarySongs.push(song);
            } else {
                const docs = catalogIDQuerySnapshot.docs;
                const data = docs[0].data(); 
                const isrcCode = data.isrcCode; 
                existingIsrcCodes.push(isrcCode); 
    
                existingAppleMusicLibrarySongs.push(song);
            }
        }
        return [existingAppleMusicLibrarySongs, existingIsrcCodes, missingAppleMusicLibrarySongs];
    }
    
    // static storeAppleMusicLibrarySongsIntoIsrcStore = async (appleMusicSongs: Array<AppleMusicLibrarySong>): Promise<void> => { 
    
    // }
}

// https://medium.com/@dorathedev/uploading-json-objects-as-json-files-to-firebase-storage-without-having-or-creating-a-json-file-38ad323af3c4