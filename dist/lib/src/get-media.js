"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeInstagramMedia = exports.getMediaForUser = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var config_1 = require("./config");
var resize_image_1 = require("./resize-image");
function getMediaForUser(_a) {
    var e_1, _b;
    var user_id = _a.user_id, fields = _a.fields, _c = _a.limit, limit = _c === void 0 ? 25 : _c, access_token = _a.access_token, after = _a.after, resize_to = _a.resize_to, include_thumbnail = _a.include_thumbnail;
    return __awaiter(this, void 0, void 0, function () {
        var requestUrl, params, paramsToAppend, mediaResponse, _d, _e, media, resizedResources, thumbnailResource, e_1_1;
        var _this = this;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    requestUrl = config_1.baseUrl + "/v8.0/" + user_id + "/media";
                    params = new URLSearchParams({});
                    if (fields.length) {
                        params.append("fields", fields.join(","));
                    }
                    params.append("limit", limit + "");
                    params.append("access_token", access_token);
                    if (after) {
                        params.append("after", after + "");
                    }
                    paramsToAppend = params.toString();
                    if (paramsToAppend) {
                        requestUrl += "?" + paramsToAppend;
                    }
                    return [4 /*yield*/, node_fetch_1.default(requestUrl, {
                            method: "GET",
                        }).then(function (data) { return data.json(); })];
                case 1:
                    mediaResponse = _f.sent();
                    if (mediaResponse.error) {
                        return [2 /*return*/, Promise.reject(mediaResponse.error)];
                    }
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 10, 11, 16]);
                    _d = __asyncValues(mediaResponse.data);
                    _f.label = 3;
                case 3: return [4 /*yield*/, _d.next()];
                case 4:
                    if (!(_e = _f.sent(), !_e.done)) return [3 /*break*/, 9];
                    media = _e.value;
                    if (!resize_to) return [3 /*break*/, 6];
                    return [4 /*yield*/, Promise.all(resize_to.map(function (resizeConfig) { return __awaiter(_this, void 0, void 0, function () {
                            var resizedImage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, resizeInstagramMedia(media, resizeConfig)];
                                    case 1:
                                        resizedImage = _a.sent();
                                        if (!resizedImage) {
                                            return [2 /*return*/, { size: resizeConfig.size, resized: false }];
                                        }
                                        return [2 /*return*/, {
                                                resized: true,
                                                size: resizeConfig.size,
                                                resized_resource_path: resizedImage,
                                            }];
                                }
                            });
                        }); }))];
                case 5:
                    resizedResources = _f.sent();
                    media.resized_resources = resizedResources;
                    _f.label = 6;
                case 6:
                    if (!include_thumbnail) return [3 /*break*/, 8];
                    return [4 /*yield*/, resizeInstagramMedia(media, include_thumbnail)];
                case 7:
                    thumbnailResource = _f.sent();
                    if (thumbnailResource) {
                        media.thumbnail_resource = {
                            size: include_thumbnail.size,
                            thumbnail_resource_path: thumbnailResource,
                        };
                    }
                    _f.label = 8;
                case 8: return [3 /*break*/, 3];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _f.trys.push([11, , 14, 15]);
                    if (!(_e && !_e.done && (_b = _d.return))) return [3 /*break*/, 13];
                    return [4 /*yield*/, _b.call(_d)];
                case 12:
                    _f.sent();
                    _f.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16: return [2 /*return*/, mediaResponse];
            }
        });
    });
}
exports.getMediaForUser = getMediaForUser;
function resizeInstagramMedia(media, resizeConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, path, suffix, destinationPath, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    // do not resize if one of the config is missing
                    if (!resizeConfig.destination_config ||
                        !resizeConfig.destination_config.path ||
                        !resizeConfig.destination_config.suffix) {
                        return [2 /*return*/];
                    }
                    // if current media is not a image resize operation can not be applied
                    if (!media.media_url || media.media_type !== "IMAGE") {
                        return [2 /*return*/];
                    }
                    _a = resizeConfig.destination_config, path = _a.path, suffix = _a.suffix;
                    destinationPath = path + "/" + (media.shortcode || media.id) + suffix;
                    return [4 /*yield*/, resize_image_1.resizeImage({
                            size: resizeConfig.size,
                            source_url: media.media_url,
                            destination_path: destinationPath,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/, destinationPath];
                case 2:
                    err_1 = _b.sent();
                    console.error("Could not resize image", err_1);
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.resizeInstagramMedia = resizeInstagramMedia;
