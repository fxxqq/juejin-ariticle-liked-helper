"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const listController = __importStar(require("./controllers/list"));
const app = express_1.default();
app.get('/api/getList/:userId', listController.getLikeList);
app.use(function (err, req, res, next) {
    return res.sendStatus(500);
});
app.listen(config_1.systemConfig.port, function () {
    console.log(`the server is start at port ${config_1.systemConfig.port}`);
});
exports.default = app;
