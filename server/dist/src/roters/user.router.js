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
var log4js_1 = __importDefault(require("log4js"));
var util_1 = require("./util");
var logger = log4js_1.default.getLogger('SERVER');
logger.level = 'trace';
var router = new koa_router_1.default({ prefix: '/user' });
router.get('/byDevice', function (ctx) { return getUsersByDevice(ctx); });
router.get('/all', function (ctx) { return getUsers(ctx); });
router.get('/byOrganisation', function (ctx) { return getUsersByOrganisation(ctx); });
router.post('/edite', function (ctx) { return editeProfile(ctx); });
router.post('/addOrganisation', function (ctx) { return addOrganisation(ctx); });
router.post('/removeUsers', function (ctx) { return removeUsers(ctx); });
router.post('/removeUsersFromOrganisation', function (ctx) { return removeUsersFromOrganisation(ctx); });
var getUsersByDevice = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var idDevice_1, allDevices, allUsers_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 3];
                idDevice_1 = ctx.query.idDevice;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 1:
                allDevices = _a.sent();
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_USERS)];
            case 2:
                allUsers_1 = _a.sent();
                ctx.body = JSON.stringify({
                    status: 200,
                    result: !allDevices || !allDevices.length
                        ? []
                        : allDevices
                            .filter(function (device) { return device.uid === idDevice_1; })
                            .map(function (device) {
                            var user = allUsers_1 && allUsers_1.find(function (user) { return user.id === device.user; });
                            return user ? { user: user.userName, state: device.isBlock ? 'blocked' : 'active' } : 'not found user';
                        })
                });
                logger.info('get users by device successfully');
                return [3, 4];
            case 3:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _a.label = 4;
            case 4: return [2];
        }
    });
}); };
var getUsers = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var allUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 2];
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_USERS)];
            case 1:
                allUsers = _a.sent();
                ctx.body = JSON.stringify({
                    status: 200,
                    result: !allUsers || !allUsers.length
                        ? []
                        : allUsers
                            .map(function (user) { return ({ id: user.id, userName: user.userName, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, creatorId: user.creatorId }); })
                });
                logger.info('get users by device successfully');
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
var getUsersByOrganisation = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var idOrganisation_1, allUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 2];
                idOrganisation_1 = ctx.query.idOrganisation;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_USERS)];
            case 1:
                allUsers = _a.sent();
                ctx.body = JSON.stringify({
                    status: 200,
                    result: allUsers && allUsers
                        .filter(function (user) { return user.organisations && user.organisations.length && user.organisations.find(function (org) { return org === idOrganisation_1; }); })
                        .map(function (user) { return ({ id: user.id, userName: user.userName, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, creatorId: user.creatorId }); })
                });
                logger.info('get users by organisation successfully');
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
var editeProfile = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser_1, allUsers, idx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 5];
                newUser_1 = ctx.request.body;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_USERS)];
            case 1:
                allUsers = _a.sent();
                idx = allUsers && allUsers.findIndex(function (user) { return user.userName === newUser_1.userName; });
                if (!(!allUsers || idx === undefined || idx < 0)) return [3, 2];
                ctx.body = JSON.stringify({ status: 404, result: "no such user(" + newUser_1.userName + ")" });
                logger.warn("no such user(" + newUser_1.userName + ")");
                return [3, 4];
            case 2: return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_USERS, JSON.stringify(__spread(allUsers.slice(0, idx), [__assign(__assign({}, allUsers[idx]), { lastName: newUser_1.lastName, firstName: newUser_1.firstName, phoneNumber: newUser_1.phoneNumber, password: newUser_1.password })], allUsers.slice(idx + 1))))];
            case 3:
                _a.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'user edited successfully' });
                logger.info('user edited successfully');
                _a.label = 4;
            case 4: return [3, 6];
            case 5:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _a.label = 6;
            case 6: return [2];
        }
    });
}); };
var addOrganisation = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, organisationId, userId, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 2];
                _a = ctx.request.body, organisationId = _a.organisationId, userId = _a.userId;
                return [4, util_1.editeOrganisations(userId, [organisationId])];
            case 1:
                res = _b.sent();
                if (res === 0) {
                    ctx.body = JSON.stringify({ status: 200, result: "organization(" + organisationId + ") added to user(" + userId + ")" });
                    logger.info("organization(" + organisationId + ") added to user(" + userId + ")");
                }
                else {
                    ctx.body = JSON.stringify({ status: 404, result: "no such user(" + userId + ")" });
                    logger.warn("no such user(" + userId + ")");
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
var removeUsers = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var users_1, allUsers, newUsers, allDevices, newDevices, allCodes, newCodes;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 7];
                users_1 = ctx.request.body.users;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_USERS)];
            case 1:
                allUsers = _d.sent();
                newUsers = (_a = allUsers) === null || _a === void 0 ? void 0 : _a.filter(function (all_u) { return !users_1.findIndex(function (u) { return u.id === all_u.id; }); });
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_DEVICES)];
            case 2:
                allDevices = _d.sent();
                newDevices = (_b = allDevices) === null || _b === void 0 ? void 0 : _b.filter(function (all_d) { return !users_1.findIndex(function (u) { return u.id === all_d.user; }); });
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_ACTIVATION_CODES)];
            case 3:
                allCodes = _d.sent();
                newCodes = (_c = allCodes) === null || _c === void 0 ? void 0 : _c.filter(function (all_d) { return !users_1.findIndex(function (u) { return u.id === all_d.user; }); });
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_USERS, JSON.stringify(newUsers))];
            case 4:
                _d.sent();
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_DEVICES, JSON.stringify(newDevices))];
            case 5:
                _d.sent();
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_ACTIVATION_CODES, JSON.stringify(newCodes))];
            case 6:
                _d.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'users removed successfully' });
                logger.info('users removed successfully');
                return [3, 8];
            case 7:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _d.label = 8;
            case 8: return [2];
        }
    });
}); };
var removeUsersFromOrganisation = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, users_2, organisationId_1, allUsers, newUsers;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 3];
                _a = ctx.request.body, users_2 = _a.users, organisationId_1 = _a.organisationId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_USERS)];
            case 1:
                allUsers = _c.sent();
                newUsers = (_b = allUsers) === null || _b === void 0 ? void 0 : _b.map(function (all_u) { var _a; return users_2.findIndex(function (u) { return u === all_u.id; }) !== -1 ? __assign(__assign({}, all_u), { organisations: (_a = all_u.organisations) === null || _a === void 0 ? void 0 : _a.filter(function (o) { return o !== organisationId_1; }) }) : all_u; });
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_USERS, JSON.stringify(newUsers))];
            case 2:
                _c.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'users removed successfully' });
                logger.info('users removed successfully');
                return [3, 4];
            case 3:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _c.label = 4;
            case 4: return [2];
        }
    });
}); };
exports.default = router;
