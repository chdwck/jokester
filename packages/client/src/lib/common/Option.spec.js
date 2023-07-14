import { describe, it, expect } from 'vitest';
import Option from '@/lib/common/Option'

describe('Option', () => {
    it('can be constructed with a value', () => {
        const option = Option.some(1)
        expect(option.some).toStrictEqual(1);
        expect(option.isNone).toStrictEqual(false);
    });

    it('can be constructed with no value', () => {
        const option = Option.none()
        expect(option.some).toBe(undefined)
        expect(option.isNone).toStrictEqual(true);
    });
});