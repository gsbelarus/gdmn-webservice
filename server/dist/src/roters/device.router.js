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
var workWithFile_1 = require("../workWithFile");
var rest_1 = require("../rest");
var util_1 = require("./util");
var log4js_1 = __importDefault(require("log4js"));
var logger = log4js_1.default.getLogger('SERVER');
logger.level = 'trace';
var router = new koa_router_1.default({ prefix: '/device' });
router.get('/verifyCode', function (ctx) { return verifyCode(ctx); });
router.get('/getActivationCode', function (ctx) { return getActivationCode(ctx); });
router.post('/new', function (ctx) { return newDevice(ctx); });
router.post('/lock', function (ctx) { return lockDevices(ctx); });
router.post('/remove', function (ctx) { return removeDevices(ctx); });
router.get('/isExist', function (ctx) { return isExistDevice(ctx); });
router.get('/isActive', function (ctx) { return isActiveDevice(ctx); });
router.get('/byUser', function (ctx) { return getDevicesByUser(ctx); });
var verifyCode = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var data, code, date;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_ACTIVATION_CODES)];
            case 1:
                data = _b.sent();
                code = data && data.find(function (code) { return code.code === ctx.query.code; });
                if (!code) return [3, 5];
                date = new Date(code.date);
                date.setDate(date.getDate() + 7);
                if (!(date >= new Date())) return [3, 3];
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify((_a = data) === null || _a === void 0 ? void 0 : _a.filter(function (code) { return code.code !== ctx.query.code; })))];
            case 2:
                _b.sent();
                ctx.status = 200;
                ctx.body = JSON.stringify({ status: 200, result: code.user });
                logger.info('device activated successfully');
                return [3, 4];
            case 3:
                ctx.status = 200;
                ctx.body = JSON.stringify({ status: 404, result: 'invalid activation code' });
                logger.warn('invalid activation code');
                _b.label = 4;
            case 4: return [3, 6];
            case 5:
                ctx.status = 200;
                ctx.body = JSON.stringify({ status: 404, result: 'invalid activation code' });
                logger.warn('invalid activation code');
                _b.label = 6;
            case 6: return [2];
        }
    });
}); };
var getActivationCode = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.query.user;
                return [4, util_1.saveActivationCode(userId)];
            case 1:
                code = _a.sent();
                ctx.status = 200;
                ctx.body = JSON.stringify({ status: 200, result: code });
                logger.info('activation code generate successfully');
                return [2];
        }
    });
}); };
var newDevice = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uid_1, userId_1, allDevices;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!ctx.isUnauthenticated()) return [3, 5];
                _a = ctx.request.body, uid_1 = _a.uid, userId_1 = _a.userId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _b.sent();
                if (!!(allDevices && allDevices.find(function (device) { return device.uid === uid_1 && device.user === userId_1; }))) return [3, 3];
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_DEVICES, JSON.stringify(allDevices
                        ? __spread(allDevices, [{ uid: uid_1, user: userId_1, isBlock: false }]) : [{ uid: uid_1, user: userId_1, isBlock: false }]))];
            case 2:
                _b.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'new device added successfully' });
                logger.info('new device added successfully');
                return [3, 4];
            case 3:
                ctx.body = JSON.stringify({ status: 404, result: "this device(" + uid_1 + ") is assigned to this user(" + userId_1 + ")" });
                logger.warn("this device(" + uid_1 + ") is assigned to this user(" + userId_1 + ")");
                _b.label = 4;
            case 4: return [3, 6];
            case 5:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _b.label = 6;
            case 6: return [2];
        }
    });
}); };
var lockDevice = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uid_2, userId_2, allDevices, idx;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 5];
                _a = ctx.request.body, uid_2 = _a.uid, userId_2 = _a.userId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _b.sent();
                idx = allDevices && allDevices.findIndex(function (device) { return device.uid === uid_2 && device.user === userId_2; });
                if (!(!allDevices || idx === undefined || idx < 0)) return [3, 2];
                ctx.body = JSON.stringify({ status: 404, result: "the device(" + uid_2 + ") is not assigned to the user(" + userId_2 + ")" });
                logger.warn("the device(" + uid_2 + ") is not assigned to the user(" + userId_2 + ")");
                return [3, 4];
            case 2: return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_DEVICES, JSON.stringify(__spread(allDevices.slice(0, idx), [{ uid: uid_2, user: userId_2, isBlock: true }], allDevices.slice(idx + 1))))];
            case 3:
                _b.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'device locked successfully' });
                logger.info('device locked successfully');
                _b.label = 4;
            case 4: return [3, 6];
            case 5:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _b.label = 6;
            case 6: return [2];
        }
    });
}); };
var lockDevices = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uIds_1, userId_3, allDevices, newDevices;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 5];
                _a = ctx.request.body, uIds_1 = _a.uIds, userId_3 = _a.userId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _d.sent();
                if (!(!uIds_1 || !userId_3 || !((_b = allDevices) === null || _b === void 0 ? void 0 : _b.filter(function (device) { return uIds_1.findIndex(function (u) { return u === device.uid; }) > -1 && device.user === userId_3; }).length))) return [3, 2];
                ctx.body = JSON.stringify({ status: 200, result: "the devices(" + JSON.stringify(uIds_1) + ") is not assigned to the user(" + userId_3 + ")" });
                logger.warn("the device(" + JSON.stringify(uIds_1) + ") is not assigned to the user(" + userId_3 + ")");
                return [3, 4];
            case 2:
                newDevices = (_c = allDevices) === null || _c === void 0 ? void 0 : _c.map(function (device) { return uIds_1.findIndex(function (u) { return u === device.uid; }) > -1 && device.user === userId_3 ? __assign(__assign({}, device), { isBlock: true }) : device; });
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_DEVICES, JSON.stringify(newDevices))];
            case 3:
                _d.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'devices locked successfully' });
                logger.info('devices locked successfully');
                _d.label = 4;
            case 4: return [3, 6];
            case 5:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _d.label = 6;
            case 6: return [2];
        }
    });
}); };
var removeDevice = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uid_3, userId_4, allDevices, idx;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 5];
                _a = ctx.request.body, uid_3 = _a.uid, userId_4 = _a.userId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _b.sent();
                idx = allDevices && allDevices.findIndex(function (device) { return device.uid === uid_3 && device.user === userId_4; });
                if (!(!allDevices || idx === undefined || idx < 0)) return [3, 2];
                ctx.body = JSON.stringify({ status: 200, result: "the device(" + uid_3 + ") is not assigned to the user(" + userId_4 + ")" });
                logger.warn("the device(" + uid_3 + ") is not assigned to the user(" + userId_4 + ")");
                return [3, 4];
            case 2: return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_DEVICES, JSON.stringify(__spread(allDevices.slice(0, idx), allDevices.slice(idx + 1))))];
            case 3:
                _b.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'device removed successfully' });
                logger.info('device removed successfully');
                _b.label = 4;
            case 4: return [3, 6];
            case 5:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _b.label = 6;
            case 6: return [2];
        }
    });
}); };
var removeDevices = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uIds_2, userId_5, allDevices, newDevices;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 5];
                _a = ctx.request.body, uIds_2 = _a.uIds, userId_5 = _a.userId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _d.sent();
                if (!(!uIds_2 || !userId_5 || !((_b = allDevices) === null || _b === void 0 ? void 0 : _b.filter(function (device) { return uIds_2.findIndex(function (u) { return u === device.uid; }) > -1 && device.user === userId_5; }).length))) return [3, 2];
                ctx.body = JSON.stringify({ status: 200, result: "the devices(" + JSON.stringify(uIds_2) + ") is not assigned to the user(" + userId_5 + ")" });
                logger.warn("the device(" + JSON.stringify(uIds_2) + ") is not assigned to the user(" + userId_5 + ")");
                return [3, 4];
            case 2:
                newDevices = (_c = allDevices) === null || _c === void 0 ? void 0 : _c.filter(function (device) { return !(uIds_2.findIndex(function (u) { return u === device.uid; }) > -1 && device.user === userId_5); });
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_DEVICES, JSON.stringify(newDevices))];
            case 3:
                _d.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'devices removed successfully' });
                logger.info('devices removed successfully');
                _d.label = 4;
            case 4: return [3, 6];
            case 5:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _d.label = 6;
            case 6: return [2];
        }
    });
}); };
var isActiveDevice = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uid, userId, allDevices, idx;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = ctx.query, uid = _a.uid, userId = _a.userId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _b.sent();
                idx = allDevices && allDevices.findIndex(function (device) { return device.uid === uid && device.user === userId; });
                if (!allDevices || idx === undefined || idx < 0) {
                    ctx.body = JSON.stringify({ status: 404, result: "the device(" + uid + ") is not assigned to the user(" + userId + ")" });
                    logger.warn("the device(" + uid + ") is not assigned to the user(" + userId + ")");
                }
                else {
                    ctx.body = JSON.stringify({ status: 200, result: !allDevices[idx].isBlock });
                    logger.info("device active: " + !allDevices[idx].isBlock);
                }
                return [2];
        }
    });
}); };
var isExistDevice = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var uid, allDevices, idx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uid = ctx.query.uid;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _a.sent();
                idx = allDevices && allDevices.findIndex(function (device) { return device.uid === uid; });
                if (!allDevices || idx === undefined || idx < 0) {
                    ctx.body = JSON.stringify({ status: 200, result: false });
                    logger.warn("the device(" + uid + ") is not exist");
                }
                else {
                    ctx.body = JSON.stringify({ status: 200, result: true });
                    logger.info("the device(" + uid + ") is exist");
                }
                return [2];
        }
    });
}); };
var getDevicesByUser = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_6, allDevices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 2];
                userId_6 = ctx.query.userId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _a.sent();
                ctx.body = JSON.stringify({
                    status: 200,
                    result: !allDevices || !allDevices.length
                        ? []
                        : allDevices
                            .filter(function (device) { return device.user === userId_6; })
                            .map(function (device) { return { uid: device.uid, state: device.isBlock ? 'blocked' : 'active' }; })
                });
                logger.info('get devices by user successfully');
                return [3, 3];
            case 2:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _a.label = 3;
            case 3: return [2];
        }
    });
}); };
exports.default = router;
