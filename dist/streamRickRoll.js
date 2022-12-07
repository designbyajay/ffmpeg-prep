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
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const which = (bin) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => (0, node_child_process_1.exec)(`which ${bin}`, (error, stdout) => {
        if (error)
            reject(error);
        resolve(stdout);
    }));
});
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    return `${yield which('ffmpeg')} ${yield which('ffprobe')}`;
});
