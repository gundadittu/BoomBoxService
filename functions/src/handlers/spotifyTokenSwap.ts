import * as functions from 'firebase-functions';
import { ErrorManager, LogManager } from '../index';
import axios, { AxiosRequestConfig } from 'axios';

const spotifyCallback = "boombox-spotify-login://callback";
const spotifyClientSecret = "f446f242b44e4c29a4449503724853a5";
var spotifyClientId = "c9632b686dac475196925c644853531e";
var spotifyAuthHeaderString = (Buffer.from(spotifyClientId + ":" + spotifyClientSecret, 'utf8')).toString('base64');
var spotifyAuthorizationHeader = 'Basic ' + spotifyAuthHeaderString;

export const spotifyTokenSwap = functions.https.onRequest(async (req, res) => {

    const code = req.body.code;
    if (code === null || code === undefined) {
        let e = new functions.https.HttpsError("invalid-argument", "Missing code parameter in request body.");
        ErrorManager.reportErrorAndSetContext(e, "Missing code parameters in request body.", { header: req.header, body: req.body });
        res.status(400).json({ error: "Missing code in request body." });
        return
    }
    var params = {
        grant_type: 'authorization_code',
        redirect_uri: spotifyCallback,
        code: req.body.code,
    };

    let spotifyTokenSwapReqConfig: AxiosRequestConfig = {
        method: 'post',
        baseURL: 'https://accounts.spotify.com/api/',
        url: '/token',
        params: {
            ...params,
        },
        headers: {
            Authorization: spotifyAuthorizationHeader,
        },
    };
    LogManager.info("Spotify token swap request config", spotifyTokenSwapReqConfig);
    let spotifyTokenReq = await axios(spotifyTokenSwapReqConfig);

    const status = spotifyTokenReq.status;
    const body = spotifyTokenReq.data;

    res.status(status);
    res.json(body);
});

export const spotifyRefreshTokenSwap = functions.https.onRequest(async (req, res) => {
    const refreshToken = req.body.refresh_token;
    if (refreshToken === null || refreshToken === undefined) {
        let e = new functions.https.HttpsError("invalid-argument", "Missing refresh_token parameter in request body.");
        ErrorManager.reportErrorAndSetContext(e, "Missing refresh_token parameters in request body.", { header: req.header, body: req.body });
        res.status(400).json({ error: "Missing refresh_token in request body." });
        return
    }

    var params = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    };

    let spotifyRefreshTokenSwapReqConfig: AxiosRequestConfig = {
        method: 'post',
        baseURL: 'https://accounts.spotify.com/api/',
        url: '/token',
        params: {
            ...params,
        },
        headers: {
            Authorization: spotifyAuthorizationHeader,
        },
    };
    let spotifyRefreshTokenReq = await axios(spotifyRefreshTokenSwapReqConfig);

    const status = spotifyRefreshTokenReq.status;
    const body = spotifyRefreshTokenReq.data;

    res.status(status);
    res.json(body);
});
