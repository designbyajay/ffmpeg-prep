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
const express_1 = __importDefault(require("express"));
const promises_1 = require("node:fs/promises");
const node_fs_1 = require("node:fs");
const app = (0, express_1.default)();
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const index = yield (0, promises_1.readFile)('public/index.html', { encoding: 'utf-8' });
    res.send(index);
}));
app.get('/example', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    // const rickRoll = await streamRickRoll();
    // res.send(rickRoll)
    const range = req.headers.range;
    if (!range)
        res.status(400).send("requires range header");
    const videoPath = `${__dirname}/public/sample.mp4`;
    const videoSize = (yield (0, promises_1.stat)(videoPath)).size;
    const [start, end] = range.split("=")[1].split("-").map(s => parseInt(s));
    // const end = Math.min(start + 1000000, videoSize - 1)
    res.status(206).set({
        'Content-Type': 'video/mp4',
        'Content-Length': `${end - start + 1}`,
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${videoSize}`
    });
    const videoStream = (0, node_fs_1.createReadStream)(videoPath, { start, end });
    try {
        // console.log(videoStream)
        for (var _d = true, videoStream_1 = __asyncValues(videoStream), videoStream_1_1; videoStream_1_1 = yield videoStream_1.next(), _a = videoStream_1_1.done, !_a;) {
            _c = videoStream_1_1.value;
            _d = false;
            try {
                const chunk = _c;
                console.log(chunk);
                res.write(chunk);
            }
            finally {
                _d = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = videoStream_1.return)) yield _b.call(videoStream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.end();
}));
app.listen(8080);
