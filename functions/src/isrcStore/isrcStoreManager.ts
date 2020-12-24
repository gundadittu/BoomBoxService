import { Firebase, ErrorManager, Logger } from '../index';
import * as firestoreConstants from '../constants/firestoreConstants';
import {
    AppleMusicCatalogSong,
    validateAppleMusicCatalogSong,
    DisabledAppleMusicCatalogSong,
    validateDisabledAppleMusicCatalogSong
} from '../appleMusic/appleMusicTypes';
import { IsrcStoreItem } from './isrcStoreTypes';

// Added to address this issue: https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };

export class IsrcStoreManager {

    static storeAppleMusicCatalogSongsIntoIsrcStore = async (appleMusicCatalogSongs: Array<AppleMusicCatalogSong | DisabledAppleMusicCatalogSong>): Promise<Array<IsrcStoreItem>> => {
        Logger.info("storeAppleMusicCatalogSongsIntoIsrcStore() inputs:", {appleMusicCatalogSongs: appleMusicCatalogSongs})
        
        var allNewIsrcStoreItems: Array<IsrcStoreItem> = [];
        for (var currSong of appleMusicCatalogSongs) {
            if (validateAppleMusicCatalogSong(currSong)) {
                const enabledAMCatalogSong: AppleMusicCatalogSong = currSong;
                const disabledValue = false;
                const isrcIdValue = enabledAMCatalogSong.attributes.isrc;
                const mediaTypeValue = "song";
                const appleMusicCatalogIdValue = enabledAMCatalogSong.id;

                const newIsrcStoreItem: IsrcStoreItem = {
                    isrcId: isrcIdValue,
                    disabled: disabledValue,
                    mediaType: mediaTypeValue,
                    appleMusicCatalogId: appleMusicCatalogIdValue,
                    appleMusicCatalogSong: enabledAMCatalogSong
                    // spotifyId: string, // TODO: 
                    // spotifyTrack: SpotifyTrack // TODO: 
                }
                allNewIsrcStoreItems.push(newIsrcStoreItem)
            } else if (validateDisabledAppleMusicCatalogSong(currSong)) {
                const disabledAMCatalogSong: DisabledAppleMusicCatalogSong = currSong;
                const disabledValue = false;
                const isrcIdValue = disabledAMCatalogSong.attributes.isrc;
                const mediaTypeValue = "song";
                const appleMusicCatalogIdValue = disabledAMCatalogSong.id;

                const newIsrcStoreItem: IsrcStoreItem = {
                    isrcId: isrcIdValue,
                    disabled: disabledValue,
                    mediaType: mediaTypeValue,
                    appleMusicCatalogId: appleMusicCatalogIdValue,
                    appleMusicCatalogSong: disabledAMCatalogSong
                    // spotifyId: string, // TODO: 
                    // spotifyTrack: SpotifyTrack // TODO: 
                }
                allNewIsrcStoreItems.push(newIsrcStoreItem)
            } else {
                const errorMessage = "Provided an invalid AppleMusicCatalogSong | DisabledAppleMusicCatalogSong object to store in IsrcStore.";
                let e = Error(errorMessage);
                ErrorManager.reportErrorAndSetContext(e, "catalog song data", currSong);
                continue
            }
        }

        // Insert allNewIsrcStoreItems into database
        // Need to split ids into chunks of < 500 due to firebase constraints 
        const splitNewIsrcStoreItems = (items: Array<IsrcStoreItem>): Array<Array<IsrcStoreItem>> => {
            var allChunks: Array<Array<IsrcStoreItem>> = [];
            var i, j, chunkSize = 499;
            for (i = 0, j = items.length; i < j; i += chunkSize) {
                const temp: Array<IsrcStoreItem> = items.slice(i, i + chunkSize);
                allChunks.push(temp);
            }
            return allChunks;
        }

        Logger.info("storeAppleMusicCatalogSongsIntoIsrcStore() output:", {allNewIsrcStoreItems: allNewIsrcStoreItems})

        let newIsrcItemChunks: Array<Array<IsrcStoreItem>> = splitNewIsrcStoreItems(allNewIsrcStoreItems);
        for (const chunk of newIsrcItemChunks) {
            let firestoreBatch = Firebase.firestoreClient.batch();
            for (const newIsrcStoreItem of chunk) {
                const isrcStoreItemUid = newIsrcStoreItem.isrcId;
                const docRef = Firebase.firestoreClient.doc(firestoreConstants.IsrcStoreCollectionKey + "/" + isrcStoreItemUid)
                firestoreBatch.set(docRef, newIsrcStoreItem)
            }
            await firestoreBatch.commit();
        }

        return allNewIsrcStoreItems;
    }
}

 // static checkForMissingIsrcStoreItemsFromAppleMusicSongs = async (librarySongs: Array<AppleMusicCatalogSong | DisabledAppleMusicCatalogSong>): Promise<Array<AppleMusicCatalogSong | DisabledAppleMusicCatalogSong>> => {
    //     // https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html
    //     const appleMusicIsrcStoreCollectionRef = await firestoreClient.collection(AppleMusicIsrcStoreCollectionKey);

    //     var missingSongs: Array<AppleMusicCatalogSong | DisabledAppleMusicCatalogSong> = [];
    //     for (var i = 0; i < librarySongs.length; i++) {
    //         const song = librarySongs[i] as AppleMusicLibrarySong;
    //         const attributes = song.attributes as AppleMusicLibrarySongAttributes;
    //         const playParams = attributes.playParams as AppleMusicLibrarySongAttributesPlayParams;
    //         const catalogID = playParams.catalogId;
    //         // TODO: create this query index in firestore 
    //         // https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#where ; https://googleapis.dev/nodejs/firestore/latest/QuerySnapshot.html
    //         const catalogIDQuerySnapshot = await appleMusicIsrcStoreCollectionRef.where("appleMusicCatalogId", '==', catalogID).get();
    //         if (catalogIDQuerySnapshot.empty) {
    //             missingAppleMusicLibrarySongs.push(song);
    //         } else {
    //             const docs = catalogIDQuerySnapshot.docs;
    //             const data = docs[0].data();
    //             const isrcCode = data.isrcCode;
    //             existingIsrcCodes.push(isrcCode);

    //             existingAppleMusicLibrarySongs.push(song);
    //         }
    //     }

    //     // TODO: change first and second return value to existing isrcstoreitems 
    //     return [existingAppleMusicLibrarySongs, existingIsrcCodes, missingAppleMusicLibrarySongs];
    // }