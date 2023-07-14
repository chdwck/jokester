const { default: HitpointCache } = require('./HitpointCache.ts');

const dateNowMock = jest.spyOn(Date, 'now');

describe('HitpointCache', () => {
  beforeEach(() => {
    dateNowMock.mockReset();
  });

  it('can add an item', () => {
    const cache = new HitpointCache(2, 100);
    dateNowMock.mockReturnValue(0);

    cache.addItem('"test?"', "Test Test");

    expect(cache.data).toEqual({
      test: {
        hitCount: 0,
        lastUsedAtMs: 0,
        value: "Test Test"
      }
    });
  });

  it('can get an item', () => {
    const cache = new HitpointCache(2, 100);
    dateNowMock.mockReturnValue(0);

    cache.data = {
      test: {
        hitCount: 0,
        lastUsedAtMs: 0,
        value: "One"
      }
    };

    const result = cache.getItem('"test?"');
    expect(result).toBe("One");
    expect(cache.data.test.hitCount).toBe(1);
  });

  it('removes a cache item after its hitpoint has been reached or exceeded', () => {
    const cache = new HitpointCache(2, 100);
    cache.addItem("foo", "bar");
    cache.addItem("bizz", "wizz");

    const resultOne = cache.getItem("foo");
    const resultTwo = cache.getItem("foo");
    const resultThree = cache.getItem("foo");

    cache.data.bizz.hitCount = 2;
    const resultBizzOne = cache.getItem("bizz");
    const resultBizzTwo = cache.getItem("bizz");

    expect(resultOne).toBe("bar");
    expect(resultTwo).toBe("bar");
    expect(resultThree).toBe(undefined);

    expect(resultBizzOne).toBe("wizz");
    expect(resultBizzTwo).toBe(undefined);
  });

  it('can clean up stale values', () => {
    const cache = new HitpointCache(2, 1000);
    dateNowMock.mockReturnValue(2000);

    cache.data = {
      foo: { hitCount: 1, lastUsedAtMs: 1500, value: 'test' },
      bar: { hitCount: 2, lastUsedAtMs: 900, value: 'test' },
      baz: { hitCount: 3, lastUsedAtMs: 1000, value: 'test' }
    };

    cache.cleanCache();

    expect(Object.keys(cache.data)).toStrictEqual(['foo']);
  });
});
