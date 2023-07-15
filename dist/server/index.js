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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var axios_1 = __importDefault(require("axios"));
require("dotenv/config");
var HitpointCache_1 = __importDefault(require("./HitpointCache"));
var app = (0, express_1.default)();
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../client')));
var openaiClient = axios_1.default.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        Authorization: "Bearer ".concat(process.env.OPENAI_API_KEY),
        "Content-Type": "application/json",
    }
});
var TWO_WEEKS_MS = 1000 * 60 * 60 * 24 * 7 * 2;
var cache = new HitpointCache_1.default(10, TWO_WEEKS_MS);
var promptPrefix = "Turn the following joke into a safe for work and funny image prompt for Dall-E based on the nouns in the joke. Please response under 20 words. Do not include text in the images. Do not include text in the images. Don't mention humor in the prompt. Joke: ";
app.get('/api/v1/dalle-image', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var joke, cacheHit, dallePrompt, chatCompletion, choices, dalleImageRes, e_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!req.query.joke) {
                    res.status(400).send('Missing query param: joke');
                    return [2 /*return*/];
                }
                joke = req.query.joke;
                if (typeof joke !== 'string') {
                    res.status(400).send('Invalid Query Param: joke must be a string');
                    return [2 /*return*/];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 5, , 6]);
                cacheHit = true;
                dallePrompt = cache.getItem(joke);
                if (!!dallePrompt) return [3 /*break*/, 3];
                cacheHit = false;
                return [4 /*yield*/, openaiClient.post('chat/completions', {
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: "system", content: promptPrefix + joke }],
                    })];
            case 2:
                chatCompletion = _e.sent();
                choices = (_b = (_a = chatCompletion === null || chatCompletion === void 0 ? void 0 : chatCompletion.data) === null || _a === void 0 ? void 0 : _a.choices) !== null && _b !== void 0 ? _b : [];
                dallePrompt = (_d = (_c = choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
                if (!dallePrompt) {
                    throw new Error("Chat completion failed. Failed to create DallE prompt");
                }
                cache.addItem(joke, dallePrompt);
                _e.label = 3;
            case 3: return [4 /*yield*/, openaiClient.post('images/generations', {
                    prompt: dallePrompt,
                    size: '512x512',
                    n: 1,
                    response_format: 'url',
                })];
            case 4:
                dalleImageRes = _e.sent();
                if (cacheHit) {
                    res.set("x-cache-status", cacheHit ? "HIT" : "MISS");
                }
                res.status(200).json(dalleImageRes.data.data[0]);
                return [3 /*break*/, 6];
            case 5:
                e_1 = _e.sent();
                res.status(500).json({ error: e_1.message });
                return [3 /*break*/, 6];
            case 6:
                cache.cleanCache();
                return [2 /*return*/];
        }
    });
}); });
app.get('*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '../client/index.html'));
});
app.listen(process.env.PORT || 3000, function () { return console.log("Server running on port ".concat(process.env.PORT || 3000)); });
