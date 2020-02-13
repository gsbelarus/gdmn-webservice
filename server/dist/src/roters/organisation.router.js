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
var router = new koa_router_1.default({ prefix: '/organisation' });
router.post('/new', function (ctx) { return addOrganisation(ctx); });
router.get('/byUser', function (ctx) { return getOrganisationsByUser(ctx); });
router.get('/profile', function (ctx) { return getProfile(ctx); });
router.post('/editeProfile', function (ctx) { return editeProfile(ctx); });
var addOrganisation = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var title_1, allOrganisations, res, res1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 7];
                title_1 = ctx.query.title;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_ORGANISATIONS)];
            case 1:
                allOrganisations = _a.sent();
                if (!!(allOrganisations && allOrganisations.find(function (organisation) { return organisation.title === title_1; }))) return [3, 5];
                return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_ORGANISATIONS, JSON.stringify(allOrganisations
                        ? __spread(allOrganisations, [{ id: title_1, title: title_1, admin: ctx.state.user.id }]) : [{ id: title_1, title: title_1, admin: ctx.state.user.id }]))];
            case 2:
                _a.sent();
                return [4, util_1.editeOrganisations(ctx.state.user.id, [title_1])];
            case 3:
                res = _a.sent();
                return [4, util_1.editeOrganisations('gdmn', [title_1])];
            case 4:
                res1 = _a.sent();
                if (res === 0) {
                    ctx.body = JSON.stringify({ status: 200, result: title_1 });
                    logger.info('new organisation added successfully');
                }
                else {
                    ctx.body = JSON.stringify({ status: 404, result: "such an user(" + ctx.state.user.id + ") already exists" });
                    logger.warn("such an user(" + ctx.state.user.id + ") already exists");
                }
                return [3, 6];
            case 5:
                ctx.body = JSON.stringify({ status: 404, result: "such an organization(" + title_1 + ") already exists" });
                logger.warn("such an organization(" + title_1 + ") already exists");
                _a.label = 6;
            case 6: return [3, 8];
            case 7:
                ctx.status = 403;
                ctx.body = JSON.stringify({ status: 403, result: "access denied" });
                logger.warn("access denied");
                _a.label = 8;
            case 8: return [2];
        }
    });
}); };
var getOrganisationsByUser = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, allUsers, findUser_1, allOrganisations;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 3];
                userId_1 = ctx.query.userId;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_USERS)];
            case 1:
                allUsers = _a.sent();
                findUser_1 = allUsers && allUsers.find(function (user) { return user.id === userId_1; });
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_ORGANISATIONS)];
            case 2:
                allOrganisations = _a.sent();
                ctx.body = JSON.stringify({
                    status: 200,
                    result: !allOrganisations || !allOrganisations.length
                        ? []
                        : allOrganisations
                            .filter(function (organisation) { var _a, _b; return (_b = (_a = findUser_1) === null || _a === void 0 ? void 0 : _a.organisations) === null || _b === void 0 ? void 0 : _b.find(function (item) { return item === organisation.id; }); })
                            .map(function (organisation) {
                            var _a;
                            return { companyName: organisation.title, companyId: organisation.id, userRole: organisation.admin === ((_a = findUser_1) === null || _a === void 0 ? void 0 : _a.id) ? 'Admin' : '' };
                        })
                });
                logger.info('get organisations by user successfully');
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
var getProfile = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var idOrganisation_1, allOrganisations, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 2];
                idOrganisation_1 = ctx.query.idOrganisation;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_ORGANISATIONS)];
            case 1:
                allOrganisations = _a.sent();
                result = allOrganisations && allOrganisations.find(function (organisation) { return organisation.id === idOrganisation_1; });
                if (!allOrganisations || !result) {
                    ctx.body = JSON.stringify({ status: 404, result: "no such organization(" + idOrganisation_1 + ")" });
                    logger.warn("no such organization(" + idOrganisation_1 + ")");
                }
                else {
                    ctx.body = JSON.stringify({ status: 200, result: result });
                    logger.info('get profile organisation successfully');
                }
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
    var newOrganisation_1, allOrganisations, idx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.isAuthenticated()) return [3, 5];
                newOrganisation_1 = ctx.request.body;
                return [4, workWithFile_1.readFile(rest_1.PATH_LOCAL_DB_ORGANISATIONS)];
            case 1:
                allOrganisations = _a.sent();
                idx = allOrganisations && allOrganisations.findIndex(function (organisation) { return organisation.id === newOrganisation_1.id; });
                if (!(!allOrganisations || idx === undefined || idx < 0)) return [3, 2];
                ctx.body = JSON.stringify({ status: 404, result: "no such organization(" + newOrganisation_1.title + ")" });
                logger.warn("no such organization(" + newOrganisation_1.title + ")");
                return [3, 4];
            case 2: return [4, workWithFile_1.writeFile(rest_1.PATH_LOCAL_DB_ORGANISATIONS, JSON.stringify(__spread(allOrganisations.slice(0, idx), [__assign({ id: allOrganisations[idx].id, admin: allOrganisations[idx].admin }, newOrganisation_1)], allOrganisations.slice(idx + 1))))];
            case 3:
                _a.sent();
                ctx.body = JSON.stringify({ status: 200, result: 'organisation edited successfully' });
                logger.info('organisation edited successfully');
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
exports.default = router;
