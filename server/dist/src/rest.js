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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var cors_1 = __importDefault(require("@koa/cors"));
var roters_1 = __importDefault(require("./roters"));
var koa_session_1 = __importDefault(require("koa-session"));
var koa_passport_1 = __importDefault(require("koa-passport"));
var passport_local_1 = require("passport-local");
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var log4js_1 = __importDefault(require("log4js"));
var util_1 = require("./roters/util");
var dev_1 = __importDefault(require("../config/dev"));
var logger = log4js_1.default.getLogger('SERVER');
logger.level = 'trace';
exports.PATH_LOCAL_DB_USERS = dev_1.default.FILES_PATH + "\\DB_USERS.json";
exports.PATH_LOCAL_DB_ACTIVATION_CODES = dev_1.default.FILES_PATH + "\\DB_ACTIVATION_CODES.json";
exports.PATH_LOCAL_DB_ORGANISATIONS = dev_1.default.FILES_PATH + "\\DB_ORGANISATIONS.json";
exports.PATH_LOCAL_DB_DEVICES = dev_1.default.FILES_PATH + "\\DB_DEVICES.json";
exports.PATH_LOCAL_DB_MESSAGES = dev_1.default.FILES_PATH + "\\DB_MESSAGES\\";
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var app, CONFIG, port;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = new koa_1.default();
                    app.keys = ['super-secret-key'];
                    CONFIG = {
                        key: 'koa:sess',
                        maxAge: 28800000,
                        overwrite: true,
                        httpOnly: true,
                        signed: true,
                    };
                    app.use(koa_session_1.default(CONFIG, app));
                    app.use(koa_bodyparser_1.default());
                    koa_passport_1.default.serializeUser(function (user, done) { return done(null, user.id); });
                    koa_passport_1.default.deserializeUser(function (id, done) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = done;
                                _b = [null];
                                return [4, util_1.findById(id)];
                            case 1: return [2, _a.apply(void 0, _b.concat([(_c.sent()) || undefined]))];
                        }
                    }); }); });
                    koa_passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'userName' }, validateAuthCreds));
                    app.use(koa_passport_1.default.initialize());
                    app.use(koa_passport_1.default.session());
                    app.use(cors_1.default({
                        credentials: true
                    }));
                    app.use(roters_1.default.routes());
                    app.use(roters_1.default.allowedMethods());
                    port = 3649;
                    logger.trace('Starting listener ...');
                    return [4, new Promise(function (resolve) { return app.listen(port, function () { return resolve(); }); })];
                case 1:
                    _a.sent();
                    logger.trace('Started');
                    console.log("Rest started on http://localhost:" + port);
                    return [2];
            }
        });
    });
}
exports.init = init;
var validateAuthCreds = function (userName, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, util_1.findByUserName(userName)];
            case 1:
                user = _a.sent();
                if (!user || user.password !== password) {
                    done(null, false);
                }
                else {
                    done(null, user);
                }
                return [2];
        }
    });
}); };
