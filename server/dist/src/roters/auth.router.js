"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var log4js_1 = __importDefault(require("log4js"));
var koa_passport_1 = __importDefault(require("koa-passport"));
var util_1 = require("util");
var rest_1 = require("../rest");
var workWithFile_1 = require("../workWithFile");
var util_2 = require("./util");
var router = new koa_router_1.default();
var logger = log4js_1.default.getLogger('SERVER');
logger.level = 'trace';
router.post('/login', function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2, getLogin(ctx)];
}); }); });
router.get('/signout', function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2, getSignOut(ctx)];
}); }); });
router.post('/signup', function (ctx) { return signup(ctx); });
router.get('/me', function (ctx) { return getMe(ctx); });
var getLogin = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isUnauthenticated()) return [3, 2];
                return [4, util_1.promisify(function (cb) {
                        koa_passport_1.default.authenticate('local', cb)(ctx, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2];
                        }); }); });
                    })()];
            case 1:
                user = _a.sent();
                ctx.login(user);
                if (ctx.isAuthenticated()) {
                    ctx.status = 200;
                    ctx.body = JSON.stringify({ status: 200, result: user ? user.id : false });
                    logger.info("login user " + user);
                }
                else {
                    ctx.status = 404;
                    ctx.body = JSON.stringify({ status: 404, result: 'wrong password or login' });
                    logger.info('failed login attempt');
                }
                return [3, 3];
            case 2:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: 'you are already logged in' });
                logger.warn('this user has already logged in');
                _a.label = 3;
            case 3: return [2];
        }
    });
}); };
var getMe = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        if (ctx.isAuthenticated()) {
            user = ctx.state.user;
            delete user.password;
            ctx.status = 200;
            ctx.body = JSON.stringify({ status: 200, result: user });
            logger.info("user authenticated: " + ctx.state.user.userName);
        }
        else {
            ctx.status = 403;
            ctx.body = JSON.stringify({ status: 403, result: 'not authenticated' });
            logger.info('is unauthenticated');
        }
        return [2];
    });
}); };
var getSignOut = function (ctx) {
    if (ctx.isAuthenticated()) {
        var user = ctx.state.user.userName;
        ctx.logout();
        ctx.status = 200;
        ctx.body = JSON.stringify({ status: 200, result: 'sign out successful' });
        logger.info("user " + user + " sign out successful");
    }
    else {
        ctx.status = 403;
        ctx.body = JSON.stringify({ status: 403, result: 'left before or didn’t enter' });
        logger.warn('left before or didn’t enter');
    }
};
var signup = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, allUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newUser = ctx.request.body;
                return [4, util_2.findByUserName(newUser.userName)];
            case 1:
                if (!!(_a.sent())) return [3, 4];
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_USERS)];
            case 2:
                allUsers = _a.sent();
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_USERS, JSON.stringify(allUsers
                        ? __spread(allUsers, [__assign({ id: newUser.userName }, newUser)]) : [__assign({ id: newUser.userName }, newUser), { id: "gdmn", userName: "gdmn", creatorId: newUser.userName, password: "gdmn", organisations: [], code: "jqgxmm" }]))];
            case 3:
                _a.sent();
                ctx.status = 200;
                ctx.body = JSON.stringify({ status: 200, result: newUser });
                logger.info('sign up successful');
                return [3, 5];
            case 4:
                ctx.status = 404;
                ctx.body = JSON.stringify({ status: 404, result: 'such user already exists' });
                logger.info('such user already exists');
                _a.label = 5;
            case 5: return [2];
        }
    });
}); };
exports.default = router;
