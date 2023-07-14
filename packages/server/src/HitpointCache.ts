type CacheItem = {
  value: string;
  hitCount: number;
  lastUsedAtMs: number;
}

export default class HitpointCache {
  private data: Record<string, CacheItem>;
  private itemHitpoints: number;
  private itemExpireAfterUnusedMs;

  constructor(itemHitpoints: number, itemExpireAfterUnusedMs: number) {
    this.data = {};
    this.itemHitpoints = itemHitpoints;
    this.itemExpireAfterUnusedMs = itemExpireAfterUnusedMs;
  }

  addItem(rawKey: string, value: string) {
    const cacheItem = { hitCount: 0, value, lastUsedAtMs: Date.now() };
    this.data[this.cacheKey(rawKey)] = cacheItem;
  }

  getItem(rawKey: string): string | undefined {
    const key = this.cacheKey(rawKey);
    const item = this.data[key];

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
  }

  private cacheKey(rawKey: string): string {
    return rawKey.replace(/\W/g, '');
  }

  cleanCache() {
    const keys = Object.keys(this.data);
    const now = Date.now();

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const item = this.data[key];

      if (now - item.lastUsedAtMs >= this.itemExpireAfterUnusedMs) {
        delete this.data[key];
      }
    }
  }
}
