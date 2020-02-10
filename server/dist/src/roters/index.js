"use strict";
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
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var auth_router_1 = __importDefault(require("./auth.router"));
var organisation_router_1 = __importDefault(require("./organisation.router"));
var device_router_1 = __importDefault(require("./device.router"));
var user_router_1 = __importDefault(require("./user.router"));
var message_router_1 = __importDefault(require("./message.router"));
var rootRouter = new koa_router_1.default({ prefix: '/api' });
try {
    for (var _b = __values([auth_router_1.default, organisation_router_1.default, device_router_1.default, user_router_1.default, message_router_1.default]), _c = _b.next(); !_c.done; _c = _b.next()) {
        var route = _c.value;
        rootRouter.use(route.routes());
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    }
    finally { if (e_1) throw e_1.error; }
}
exports.default = rootRouter;
