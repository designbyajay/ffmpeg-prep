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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = require("node:fs/promises");
const streamRickRoll_1 = __importDefault(require("./streamRickRoll"));
const app = (0, express_1.default)();
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const index = yield (0, promises_1.readFile)('public/index.html', { encoding: 'utf-8' });
    res.send(index);
}));
app.get('/example', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rickRoll = yield (0, streamRickRoll_1.default)();
    res.send(rickRoll);
}));
app.get('/sample', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(`${__dirname}/public/sample.mp4`);
}));
app.listen(8080);
