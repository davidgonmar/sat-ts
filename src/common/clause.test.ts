import { expect, test, describe } from 'bun:test';
import { Clause } from '@/common/clause';

describe('Clause', () => {
  describe('constructor', () => {
    test('creates a clause from true value', () => {
      const clause = new Clause(true);
      expect(clause.value).toEqual(true);
    });
    test('creates a clause from false value', () => {
      const clause = new Clause(false);
      expect(clause.value).toEqual(false);
    });
    test('creates a clause from an array of literals', () => {
      const clause = new Clause([1, 2, 3]);
      expect(clause.value).toEqual([1, 2, 3]);
    });
    test('creates a clause from an array with mixed literals and booleans', () => {
      const clause = new Clause([1, false, 3]);
      expect(clause.value).toEqual([1, false, 3]);
    });
  });

  describe('assignLiteral', () => {
    test('value turns true when a literal is assigned true', () => {
      const clause = new Clause([1, 2, 3]);
      clause.assignLiteral(1, true);
      expect(clause.value).toEqual(true);
    });
    test('value turns true when a literal whose negation appears is assigned false', () => {
      const clause = new Clause([1, 2, 3]);
      clause.assignLiteral(-1, false);
      expect(clause.value).toEqual(true);
    });
    test('value turns false when all literals are assigned false', () => {
      const clause = new Clause([1, 2, 3]);
      clause.assignLiteral(1, false);
      clause.assignLiteral(2, false);
      clause.assignLiteral(3, false);
      expect(clause.value).toEqual(false);
    });
    test('value stays as array if not all literals are false', () => {
      const clause = new Clause([1, 2, 3]);
      clause.assignLiteral(1, false);
      clause.assignLiteral(2, false);
      expect(clause.value).toEqual([false, false, 3]);
    });
  });

  describe('unitLiteral', () => {
    test('returns null if the clause is decided', () => {
      const clause = new Clause(true);
      expect(clause.unitLiteral).toEqual(null);
    });
    test('returns null if the clause has more than one non-assigned literal', () => {
      const clause = new Clause([1, 2, 3]);
      expect(clause.unitLiteral).toEqual(null);
    });
    test('returns the literal if the clause has only one non-assigned literal', () => {
      const clause = new Clause([1, 2, 3]);
      clause.assignLiteral(1, false);
      clause.assignLiteral(2, false);
      expect(clause.unitLiteral).toEqual(3);
    });
  });

  describe('clone', () => {
    test('returns a deep copy of the clause', () => {
      const clause = new Clause([1, 2, 3]);
      const clone = clause.clone();
      expect(clause).toEqual(clone);
      expect(clause).not.toBe(clone);
    });
    test('if value is an array, it is independent from the original', () => {
      const clause = new Clause([1, 2, 3]);
      const clone = clause.clone();
      clause.assignLiteral(1, false);
      expect(clause.value).toEqual([false, 2, 3]);
      expect(clone.value).toEqual([1, 2, 3]);
    });
  });
});
