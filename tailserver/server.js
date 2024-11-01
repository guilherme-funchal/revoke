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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
var core_1 = require("@credo-ts/core");
var crypto_1 = require("crypto");
var express_1 = require("express");
var fs_1 = require("fs");
var multer_1 = require("multer");
var port = process.env.AGENT_PORT ? Number(process.env.AGENT_PORT) : 6543;
var app = (0, express_1.default)();
var baseFilePath = './tails';
var indexFilePath = "./".concat(baseFilePath, "/index.json");
if (!fs_1.default.existsSync(baseFilePath)) {
    fs_1.default.mkdirSync(baseFilePath, { recursive: true });
}
var tailsIndex = (fs_1.default.existsSync(indexFilePath) ? JSON.parse(fs_1.default.readFileSync(indexFilePath, { encoding: 'utf-8' })) : {});
var logger = new core_1.ConsoleLogger(core_1.LogLevel.debug);
function fileHash(filePath, algorithm) {
    if (algorithm === void 0) { algorithm = 'sha256'; }
    return new Promise(function (resolve, reject) {
        var shasum = (0, crypto_1.createHash)(algorithm);
        try {
            var s = fs_1.default.createReadStream(filePath);
            s.on('data', function (data) {
                shasum.update(data);
            });
            // making digest
            s.on('end', function () {
                var hash = shasum.digest('hex');
                return resolve(hash);
            });
        }
        catch (error) {
            return reject('error in calculation');
        }
    });
}
var fileStorage = (0, multer_1.diskStorage)({
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + new Date().toISOString());
    },
});
// Allow to create invitation, no other way to ask for invitation yet
app.get('/:tailsFileId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tailsFileId, fileName, path, file;
    return __generator(this, function (_a) {
        logger.debug("requested file");
        tailsFileId = req.params.tailsFileId;
        if (!tailsFileId) {
            res.status(409).end();
            return [2 /*return*/];
        }
        fileName = tailsIndex[tailsFileId];
        if (!fileName) {
            logger.debug("no entry found for tailsFileId: ".concat(tailsFileId));
            res.status(404).end();
            return [2 /*return*/];
        }
        path = "".concat(baseFilePath, "/").concat(fileName);
        try {
            logger.debug("reading file: ".concat(path));
            if (!fs_1.default.existsSync(path)) {
                logger.debug("file not found: ".concat(path));
                res.status(404).end();
                return [2 /*return*/];
            }
            file = fs_1.default.createReadStream(path);
            res.setHeader('Content-Disposition', "attachment: filename=\"".concat(fileName, "\""));
            file.pipe(res);
        }
        catch (error) {
            logger.debug("error reading file: ".concat(path));
            res.status(500).end();
        }
        return [2 /*return*/];
    });
}); });
app.put('/:tailsFileId', (0, multer_1.default)({ storage: fileStorage }).single('file'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, tailsFileId, item, hash, destinationPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger.info("tails file upload: ".concat(req.params.tailsFileId));
                file = req.file;
                if (!file) {
                    logger.info("No file found: ".concat(JSON.stringify(req.headers)));
                    return [2 /*return*/, res.status(400).send('No files were uploaded.')];
                }
                tailsFileId = req.params.tailsFileId;
                if (!tailsFileId) {
                    // Clean up temporary file
                    fs_1.default.rmSync(file.path);
                    return [2 /*return*/, res.status(409).send('Missing tailsFileId')];
                }
                item = tailsIndex[tailsFileId];
                if (item) {
                    logger.debug("there is already an entry for: ".concat(tailsFileId));
                    res.status(409).end();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, fileHash(file.path)];
            case 1:
                hash = _a.sent();
                destinationPath = "".concat(baseFilePath, "/").concat(hash);
                if (fs_1.default.existsSync(destinationPath)) {
                    logger.warn('tails file already exists');
                }
                else {
                    fs_1.default.copyFileSync(file.path, destinationPath);
                    fs_1.default.rmSync(file.path);
                }
                // Store filename in index
                tailsIndex[tailsFileId] = hash;
                fs_1.default.writeFileSync(indexFilePath, JSON.stringify(tailsIndex));
                res.status(200).end();
                return [2 /*return*/];
        }
    });
}); });
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        app.listen(port);
        logger.info("server started at port ".concat(port));
        return [2 /*return*/];
    });
}); };
void run();
