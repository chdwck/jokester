"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HitpointCache = /** @class */ (function () {
    function HitpointCache(itemHitpoints, itemExpireAfterUnusedMs) {
        this.data = {};
        this.itemHitpoints = itemHitpoints;
        this.itemExpireAfterUnusedMs = itemExpireAfterUnusedMs;
    }
    HitpointCache.prototype.addItem = function (rawKey, value) {
        var cacheItem = { hitCount: 0, value: value, lastUsedAtMs: Date.now() };
        this.data[this.cacheKey(rawKey)] = cacheItem;
    };
    HitpointCache.prototype.getItem = function (rawKey) {
        var key = this.cacheKey(rawKey);
        var item = this.data[key];
        if (!item) {
            return undefined;
        }
        item.hitCount += 1;
        if (item.hitCount >= this.itemHitpoints) {
            delete this.data[key];
            return item.value;
        }
        item.lastUsedAtMs = Date.now();
        return item.value;
    };
    HitpointCache.prototype.cacheKey = function (rawKey) {
        return rawKey.replace(/\W/g, '');
    };
    HitpointCache.prototype.cleanCache = function () {
        var keys = Object.keys(this.data);
        var now = Date.now();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = this.data[key];
            if (now - item.lastUsedAtMs >= this.itemExpireAfterUnusedMs) {
                delete this.data[key];
            }
        }
    };
    return HitpointCache;
}());
exports.default = HitpointCache;
