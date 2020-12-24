import { Logger } from "..";

export type UserStreamingAccountStoreItemAccountType = "spotify" | "appleMusic";
export function validateUserStreamingAccountStoreItemAccountType(arg: UserStreamingAccountStoreItemAccountType | any): arg is UserStreamingAccountStoreItemAccountType {
    if (arg == null || arg == undefined) {
        return false;
    }
    if (typeof arg != "string") { 
        return false; 
    }
    return arg == "spotify" || arg == "appleMusic"; 
}

export type UserStreamingAccountStoreItemLibrary = {
    isrcCodesForSongs: Array<string>;
}
export function validateUserStreamingAccountStoreItemLibrary(arg: UserStreamingAccountStoreItemLibrary | any): arg is UserStreamingAccountStoreItemLibrary {
    Logger.info("validateUserStreamingAccountStoreItemLibrary() inputs:", {arg: arg});

    if (arg == null || arg == undefined) {
        return false;
    }
    const validateIsrcCodesForSongs = (): boolean => {
        const isrcCodeList = arg.isrcCodesForSongs;
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
    Logger.info("validateUserStreamingAccountStoreItemLibrary() outputs:", {isrcCodesForSongsValidate: isrcCodesForSongsValidate});
    return isrcCodesForSongsValidate
}

export type UserStreamingAccountStoreItem = {
    userUid: string,
    accountType: UserStreamingAccountStoreItemAccountType,
    appleMusicAccessToken?: string,
    spotifyAccessToken?: string,
    library: UserStreamingAccountStoreItemLibrary
}
export function validateUserStreamingAccountStoreItem(arg: UserStreamingAccountStoreItem | any): arg is UserStreamingAccountStoreItem {
    Logger.info("validateUserStreamingAccountStoreItem() inputs:", {arg: arg});
    if (arg == null || arg == undefined) {
        return false;
    }
    const userUidValidate = typeof arg.userUid == "string";
    const accountTypeValidate = validateUserStreamingAccountStoreItemAccountType(arg.accountType);
    const accessTokenValidate = typeof arg.appleMusicAccessToken == "string" || typeof arg.spotifyAccessToken == "string";
    // TODO: check that appropriate accesstoken is provided based on account type 
    const libraryValidate = validateUserStreamingAccountStoreItemLibrary(arg.library); 
    Logger.info("validateUserStreamingAccountStoreItem() outputs:", {userUidValidate: userUidValidate, accountTypeValidate: accountTypeValidate, accessTokenValidate: accessTokenValidate, libraryValidate: libraryValidate});
    return userUidValidate && accountTypeValidate && accessTokenValidate && libraryValidate; 
}