import { Logger } from "..";

export type UserStreamingLibraryStoreItem = {
    isrcCodesForSongs: Array<string>;
}
export function validateUserStreamingLibraryStoreItem(arg: UserStreamingLibraryStoreItem | any): arg is UserStreamingLibraryStoreItem {
    Logger.info("validateUserStreamingLibraryStoreItem() inputs:", { arg: arg });

    if (arg == null || arg == undefined) {
        return false;
    }
    const validateIsrcCodesForSongs = (): boolean => {
        const isrcCodeList = arg.isrcCodesForSongs;
        if (isrcCodeList == null) { 
            return false; 
        }
        const isArrayValidate = Array.isArray(isrcCodeList);
        if (!isArrayValidate) {
            return false
        } else if ((isrcCodeList as Array<any>).length > 0) {
            return typeof isrcCodeList[0] == "string";
        } else {
            return true;
        }
    }
    const isrcCodesForSongsValidate = validateIsrcCodesForSongs();
    Logger.info("validateUserStreamingLibraryStoreItem() outputs:", { isrcCodesForSongsValidate: isrcCodesForSongsValidate });
    return isrcCodesForSongsValidate
}