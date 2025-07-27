import { getBoolFromQueryParam } from './ops';

describe('getBoolFromQueryParam', () => {
    it('returns false for null', () => {
        expect(getBoolFromQueryParam(null)).toBe(false);
    });

    it('returns true for "1"', () => {
        expect(getBoolFromQueryParam('1')).toBe(true);
    });

    it('returns true for "true" (case-insensitive)', () => {
        expect(getBoolFromQueryParam('true')).toBe(true);
        expect(getBoolFromQueryParam('TRUE')).toBe(true);
        expect(getBoolFromQueryParam('TrUe')).toBe(true);
    });

    it('returns false for "0"', () => {
        expect(getBoolFromQueryParam('0')).toBe(false);
    });

    it('returns false for "false" (case-insensitive)', () => {
        expect(getBoolFromQueryParam('false')).toBe(false);
        expect(getBoolFromQueryParam('FALSE')).toBe(false);
        expect(getBoolFromQueryParam('FaLsE')).toBe(false);
    });

    it('returns false for any other string', () => {
        expect(getBoolFromQueryParam('yes')).toBe(false);
        expect(getBoolFromQueryParam('no')).toBe(false);
        expect(getBoolFromQueryParam('random')).toBe(false);
        expect(getBoolFromQueryParam('')).toBe(false);
    });
});
