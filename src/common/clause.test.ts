import { expect, test, describe } from 'bun:test';
import { Clause } from '@/common/clause';

describe('Clause', () => {
  test('clone', () => {
    const clause = new Clause([1, 2, 3]);
    const copy = clause.clone();
    copy.assignLiteral(1, true);
    expect(clause.literals).toEqual([1, 2, 3]);
    expect(copy.literals).toEqual([true, 2, 3]);
  });

  test('containsLiteral', () => {
    const clause = new Clause([1, 2, 3]);
    expect(clause.containsLiteral(1)).toBe(true);
    expect(clause.containsLiteral(2)).toBe(true);
    expect(clause.containsLiteral(3)).toBe(true);
    expect(clause.containsLiteral(4)).toBe(false);
    expect(clause.containsLiteral(-1)).toBe(false);
  });

  test('assignLiteral', () => {
    const clause = new Clause([1, 2, 3]);
    clause.assignLiteral(1, true);
    expect(clause.literals).toEqual([true, 2, 3]);
  });

  test('unitLiteral', () => {
    const clause = new Clause([1, 2, 3]);
    expect(clause.unitLiteral).toBe(null);
    clause.assignLiteral(1, true);
    expect(clause.unitLiteral).toBe(null);
    clause.assignLiteral(2, false);
    expect(clause.unitLiteral).toBe(null);
    clause.assignLiteral(3, true);
    expect(clause.unitLiteral).toBe(null);
    expect(new Clause([1]).unitLiteral).toBe(1);
    expect(clause.isSatisfied).toBe(true);
  });

  test('isSatisfied', () => {
    const clause = new Clause([1, 2, 3]);
    expect(clause.isSatisfied).toBe(false);
    clause.assignLiteral(1, true);
    expect(clause.isSatisfied).toBe(true);
    clause.assignLiteral(2, false);
    expect(clause.isSatisfied).toBe(true);
    clause.assignLiteral(3, true);
    expect(clause.isSatisfied).toBe(true);
  });

  test('isUnsatisfiable', () => {
    const clause = new Clause([1, 2, 3]);
    expect(clause.isUnsatisfiable).toBe(false);
    clause.assignLiteral(1, false);
    expect(clause.isUnsatisfiable).toBe(false);
    clause.assignLiteral(2, false);
    expect(clause.isUnsatisfiable).toBe(false);
    clause.assignLiteral(3, false);
    expect(clause.isUnsatisfiable).toBe(true);
  });

  test('unassignedLiterals', () => {
    const clause = new Clause([1, 2, 3]);
    expect(clause.unassignedLiterals).toEqual([1, 2, 3]);
    clause.assignLiteral(1, true);
    expect(clause.unassignedLiterals).toEqual([2, 3]);
    clause.assignLiteral(2, false);
    expect(clause.unassignedLiterals).toEqual([3]);
    clause.assignLiteral(3, true);
    expect(clause.unassignedLiterals).toEqual([]);
  });
});
