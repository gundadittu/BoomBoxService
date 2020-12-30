import { Firebase, ErrorManager, LogManager } from '../index';
import * as firestoreConstants from '../constants/firestoreConstants';
import {
    AppleMusicCatalogSong,
    validateAppleMusicCatalogSong,
    // DisabledAppleMusicCatalogSong,
    // validateDisabledAppleMusicCatalogSong,
} from '../appleMusic/appleMusicTypes';
import {
    SpotifyTrack,
} from '../spotify/spotifyTypes';
import { IsrcStoreItem, validateIsrcStoreItem } from './isrcStoreTypes';

// Added to address this issue: https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };

export class IsrcStoreManager {

    static storeMissingSpotifyTracksIntoIsrcStore = async (spotifyTracks: Array<SpotifyTrack>): Promise<void> => {
        LogManager.info("storeMissingSpotifyTracksIntoIsrcStore() inputs:", { spotifyTracks: spotifyTracks })

        var missingSpotifyTracks: Array<SpotifyTrack> = [];
        for (var currSong of spotifyTracks) {
            const isrcCode = currSong.external_ids.isrc;
            const docRef = Firebase.firestoreClient.collection(firestoreConstants.IsrcStoreCollectionKey).doc(isrcCode);
            const doc = await docRef.get();
            const docData = doc.data();
            if (!doc.exists) {
                missingSpotifyTracks.push(currSong);
            } else if (validateIsrcStoreItem(docData)) {
                if (docData.availableInSpotifyCatalog == null || docData.availableInSpotifyCatalog == false) {
                    const playEnabledForSpotifyValue = (!currSong.is_local && currSong.uri && currSong.id, currSong.external_ids) ? true : false;
                    // --> This logic determines whether a spotify is track is playable in a boombox
                    await docRef.update({ playEnabledForSpotify: playEnabledForSpotifyValue, availableOnSpotify: true, spotifyId: currSong.id, spotifyTrack: currSong });
                }
            }
        }


        var allNewIsrcStoreItems: Array<IsrcStoreItem> = [];
        for (var currTrack of spotifyTracks) {
            const isrcIdValue = currTrack.external_ids.isrc;
            const mediaTypeValue = "song";
            const playEnabledForSpotifyValue = (!currTrack.is_local && currTrack.uri && currTrack.id, currTrack.external_ids) ? true : false;
            // --> This logic determines whether a spotify is track is playable in a boombox

            const newIsrcStoreItem: IsrcStoreItem = {
                isrcId: isrcIdValue,
                playEnabledForAppleMusic: false,
                playEnabledForSpotify: playEnabledForSpotifyValue,
                mediaType: mediaTypeValue,
                availableInSpotifyCatalog: true,
                spotifyId: currTrack.id,
                spotifyTrack: currTrack,
            }
            allNewIsrcStoreItems.push(newIsrcStoreItem)
        }


        // Insert allNewIsrcStoreItems into database
        await IsrcStoreManager.insertIsrcStoreItems(allNewIsrcStoreItems);

        LogManager.info("storeMissingSpotifyTracksIntoIsrcStore() output:", { allNewIsrcStoreItems: allNewIsrcStoreItems });
    }


    static storeMissingAppleMusicCatalogSongsIntoIsrcStore = async (appleMusicCatalogSongs: Array<AppleMusicCatalogSong>): Promise<void> => {
        LogManager.info("storeMissingAppleMusicCatalogSongsIntoIsrcStore() inputs:", { appleMusicCatalogSongs: appleMusicCatalogSongs })

        var missingAppleMusicCatalogSongs: Array<AppleMusicCatalogSong> = [];
        for (var catalogSong of appleMusicCatalogSongs) {
            const isrcCode = catalogSong.attributes.isrc;
            const docRef = Firebase.firestoreClient.collection(firestoreConstants.IsrcStoreCollectionKey).doc(isrcCode);
            const doc = await docRef.get();
            const docData = doc.data;
            if (!doc.exists) {
                missingAppleMusicCatalogSongs.push(catalogSong);
            } else if (validateIsrcStoreItem(docData)) {
                if (docData.availableInAppleMusicCatalog == null || docData.availableInAppleMusicCatalog == false) {
                    // TODO: add playenabled value 
                    const playEnabledForAppleMusic = (catalogSong.attributes.isrc && catalogSong.id && catalogSong.attributes.playParams) ? true : false;
                    // --> This logic decides if a Apple Music song is playable. All these values are required.
                    await docRef.update({ playEnabledForAppleMusic: playEnabledForAppleMusic, availableInAppleMusicCatalog: true, appleMusicCatalogId: catalogSong.id, appleMusicCatalogSong: catalogSong });
                }
            }
        }

        var allNewIsrcStoreItems: Array<IsrcStoreItem> = [];

        for (var currSong of missingAppleMusicCatalogSongs) {
            if (validateAppleMusicCatalogSong(currSong)) {
                const enabledAMCatalogSong: AppleMusicCatalogSong = currSong;
                const isrcIdValue = enabledAMCatalogSong.attributes.isrc;
                const mediaTypeValue = "song";
                const appleMusicCatalogIdValue = enabledAMCatalogSong.id;

                const playParams = currSong.attributes.playParams;
                const playEnabledForAppleMusic = (isrcIdValue && appleMusicCatalogIdValue && playParams) ? true : false;
                // --> This logic decides if a Apple Music song is playable. All these values are required.

                const newIsrcStoreItem: IsrcStoreItem = {
                    isrcId: isrcIdValue,
                    playEnabledForAppleMusic: playEnabledForAppleMusic,
                    playEnabledForSpotify: false,
                    mediaType: mediaTypeValue,
                    availableInAppleMusicCatalog: true,
                    appleMusicCatalogId: appleMusicCatalogIdValue,
                    appleMusicCatalogSong: enabledAMCatalogSong,
                }
                allNewIsrcStoreItems.push(newIsrcStoreItem)
                // } else if (validateDisabledAppleMusicCatalogSong(currSong)) {
                //     const disabledAMCatalogSong: DisabledAppleMusicCatalogSong = currSong;
                //     const isrcIdValue = disabledAMCatalogSong.attributes.isrc;
                //     const mediaTypeValue = "song";
                //     const appleMusicCatalogIdValue = disabledAMCatalogSong.id;

                //     const newIsrcStoreItem: IsrcStoreItem = {
                //         isrcId: isrcIdValue,
                //         playEnabledForAppleMusic: false,
                //         playEnabledForSpotify: false,
                //         mediaType: mediaTypeValue,
                //         availableInAppleMusicCatalog: true,
                //         appleMusicCatalogId: appleMusicCatalogIdValue,
                //         appleMusicCatalogSong: disabledAMCatalogSong,
                //     }
                //     allNewIsrcStoreItems.push(newIsrcStoreItem)
            } else {
                const errorMessage = "Provided an invalid AppleMusicCatalogSong object to store in IsrcStore.";
                let e = Error(errorMessage);
                ErrorManager.reportErrorAndSetContext(e, "catalog song data", currSong);
                continue
            }
        }

        // Insert allNewIsrcStoreItems into database
        await IsrcStoreManager.insertIsrcStoreItems(allNewIsrcStoreItems);

        LogManager.info("storeAppleMusicCatalogSongsIntoIsrcStore() output:", { allNewIsrcStoreItems: allNewIsrcStoreItems })
    }

    static insertIsrcStoreItems = async (isrcStoreItems: Array<IsrcStoreItem>): Promise<void> => {
        const splitNewIsrcStoreItems = (items: Array<IsrcStoreItem>): Array<Array<IsrcStoreItem>> => {
            var allChunks: Array<Array<IsrcStoreItem>> = [];
            var i, j, chunkSize = 499;
            for (i = 0, j = items.length; i < j; i += chunkSize) {
                const temp: Array<IsrcStoreItem> = items.slice(i, i + chunkSize);
                allChunks.push(temp);
            }
            return allChunks;
        }

        // Need to split ids into chunks of < 500 due to firebase constraints 
        let newIsrcItemChunks: Array<Array<IsrcStoreItem>> = splitNewIsrcStoreItems(isrcStoreItems);
        for (const chunk of newIsrcItemChunks) {
            let firestoreBatch = Firebase.firestoreClient.batch();
            for (const newIsrcStoreItem of chunk) {
                const isrcStoreItemUid = newIsrcStoreItem.isrcId;
                const docRef = Firebase.firestoreClient.doc(firestoreConstants.IsrcStoreCollectionKey + "/" + isrcStoreItemUid)
                firestoreBatch.set(docRef, newIsrcStoreItem)
            }
            await firestoreBatch.commit();
        }
        return
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