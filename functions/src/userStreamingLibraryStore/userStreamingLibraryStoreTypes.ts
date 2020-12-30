import { LogManager } from "..";
import { IsrcStoreItem, validateIsrcStoreItem } from "../isrcStore/isrcStoreTypes";

export type UserStreamingLibraryStoreItem = {
    userUid: string,
    librarySongs: Array<IsrcStoreItem>;
}
export function validateUserStreamingLibraryStoreItem(arg: UserStreamingLibraryStoreItem | any): arg is UserStreamingLibraryStoreItem {
    // LogManager.info("validateUserStreamingLibraryStoreItem() inputs:", { arg: arg });
    if (!arg) {
        return false;
    }
    const validateLibrarySongs = (librarySongs: Array<IsrcStoreItem> | null): boolean => {
        if (librarySongs == null) {
            return false;
        }

        for (var song of librarySongs) {
            if (!validateIsrcStoreItem(song)) {
                return false
            }
        }
        return true;
    }
    const librarySongsValidate = validateLibrarySongs(arg.librarySongs);
    const userUidValidate = typeof arg.userUid === "string";

    const validationStatus = userUidValidate && librarySongsValidate;
    if (!validationStatus) {
        LogManager.info("validateUserStreamingLibraryStoreItem() failed validation:", {
            arg: arg,
            userUidValidate: userUidValidate,
            librarySongsValidate: librarySongsValidate,
        });
    }
    return validationStatus;
}