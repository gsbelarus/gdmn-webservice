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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var workWithFile_1 = require("../workWithFile");
var rest_1 = require("../rest");
var log4js_1 = __importDefault(require("log4js"));
var uuid_1 = __importDefault(require("uuid"));
var fs_1 = require("fs");
var logger = log4js_1.default.getLogger('SERVER');
logger.level = 'trace';
var router = new koa_router_1.default();
router.post('/messages', function (ctx) { return newMessage(ctx); });
router.get('/messages', function (ctx) { return getMessage(ctx); });
router.delete('/messages/:id', function (ctx) { return removeMessage(ctx); });
var newMessage = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var message, organisation_1, newMessage_1, uuid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 4];
                message = ctx.request.body;
                organisation_1 = message.organisation;
                if (!ctx.state.user.organisations.find(function (item) { return item === organisation_1; })) {
                    ctx.body = JSON.stringify({ status: 404, result: "The user(" + ctx.state.user.id + ") not part of the organisation(" + organisation_1 + ")" });
                    logger.warn("The user(" + ctx.state.user.id + ") not part of the organisation(" + organisation_1 + ")");
                }
                newMessage_1 = __assign(__assign({}, message), { head: { consumer: ctx.state.user.id, producer: 'gdmn', dateTime: new Date().toString() } });
                if (!(newMessage_1 instanceof Object && newMessage_1)) return [3, 2];
                uuid = uuid_1.default();
                return [4, workWithFile_1.writeFile("" + rest_1.PATH_LOCAL_DB_MESSAGES + organisation_1 + "\\" + uuid + ".json", JSON.stringify(newMessage_1))];
            case 1:
                _a.sent();
                ctx.body = JSON.stringify({ status: 200, result: { uid: uuid, date: new Date() } });
                logger.info("new message in queue: " + uuid);
                return [3, 3];
            case 2:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 404, result: "incorrect format message" });
                logger.warn("incorrect format message");
                _a.label = 3;
            case 3: return [3, 5];
            case 4:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _a.label = 5;
            case 5: return [2];
        }
    });
}); };
var getMessage = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var organisation, result, nameFiles, nameFiles_1, nameFiles_1_1, newFile, data, e_1_1, e_2;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 13];
                organisation = ctx.query.organisation;
                result = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                return [4, fs_1.promises.readdir("" + rest_1.PATH_LOCAL_DB_MESSAGES + organisation)];
            case 2:
                nameFiles = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 8, 9, 10]);
                nameFiles_1 = __values(nameFiles), nameFiles_1_1 = nameFiles_1.next();
                _b.label = 4;
            case 4:
                if (!!nameFiles_1_1.done) return [3, 7];
                newFile = nameFiles_1_1.value;
                return [4, workWithFile_1.readFile("" + rest_1.PATH_LOCAL_DB_MESSAGES + organisation + "\\" + newFile)];
            case 5:
                data = _b.sent();
                result.push(data);
                _b.label = 6;
            case 6:
                nameFiles_1_1 = nameFiles_1.next();
                return [3, 4];
            case 7: return [3, 10];
            case 8:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 10];
            case 9:
                try {
                    if (nameFiles_1_1 && !nameFiles_1_1.done && (_a = nameFiles_1.return)) _a.call(nameFiles_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 10:
                ctx.status = 200;
                ctx.body = JSON.stringify({
                    status: 200,
                    result: result.filter(function (res) { return (!res.head.consumer || res.head.consumer && res.head.consumer === ctx.state.user.userName) && ctx.state.user.userName !== res.head.producer; })
                });
                logger.info('get message');
                return [3, 12];
            case 11:
                e_2 = _b.sent();
                logger.trace("Error reading data to directory " + rest_1.PATH_LOCAL_DB_MESSAGES + organisation + " - " + e_2);
                console.log("Error reading data to directory " + rest_1.PATH_LOCAL_DB_MESSAGES + organisation + " - " + e_2);
                ctx.status = 404;
                ctx.body = JSON.stringify({ status: 404, result: 'not found file or directory' });
                return [3, 12];
            case 12: return [3, 14];
            case 13:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _b.label = 14;
            case 14: return [2];
        }
    });
}); };
var removeMessage = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, organisation, uid, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 2];
                _a = ctx.query, organisation = _a.organisation, uid = _a.uid;
                return [4, remove(organisation, uid)];
            case 1:
                result = _b.sent();
                if (result === 'OK') {
                    ctx.status = 200;
                    ctx.body = JSON.stringify({ status: 200, result: 'OK' });
                    logger.info('get message');
                }
                else {
                    ctx.status = 404;
                    ctx.body = JSON.stringify({ status: 404, result: 'error' });
                    logger.warn('not deleted message');
                }
                return [3, 3];
            case 2:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _b.label = 3;
            case 3: return [2];
        }
    });
}); };
var remove = function (organisation, uid) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, workWithFile_1.removeFile("" + rest_1.PATH_LOCAL_DB_MESSAGES + organisation + "\\" + uid + ".json")];
            case 1: return [2, _a.sent()];
        }
    });
}); };
var get = function (organisation, uid) { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, workWithFile_1.readFile("" + rest_1.PATH_LOCAL_DB_MESSAGES + organisation + "\\" + uid + ".json")];
            case 1:
                body = _a.sent();
                return [2, body];
        }
    });
}); };
exports.default = router;
