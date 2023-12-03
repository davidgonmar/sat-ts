import { describe, expect, test } from 'bun:test';
import { DimacsParser } from './dimacs';
import { Clause } from '@/common/clause';

describe('DimacsParser', () => {
  const input1 = `
    c This is a comment
    c This is another comment
    p cnf 3 2
    1 2 3 0
    -1 -2 -3 0
  `;
  const input2 = `
    c This is a comment
    c This is another comment
    p cnf 3 2
    1 2 3 0
    -1 -2 -3 0
    c This is another comment
    `;
  const input3 = `
    p cnf 3 2
    1 2 3 0
    -1 -2 -3 0
  `;
  const input4 = `
   invalid input
  `;

  test('parse input1', () => {
    const parser = new DimacsParser(input1);
    const result = parser.parse();
    expect(result.clauses).toEqual([
      new Clause([1, 2, 3]),
      new Clause([-1, -2, -3]),
    ]);
  });

  test('parse input2', () => {
    const parser = new DimacsParser(input2);
    const result = parser.parse();
    expect(result.clauses).toEqual([
      new Clause([1, 2, 3]),
      new Clause([-1, -2, -3]),
    ]);
  });

  test('parse input3', () => {
    const parser = new DimacsParser(input3);
    const result = parser.parse();
    expect(result.clauses).toEqual([
      new Clause([1, 2, 3]),
      new Clause([-1, -2, -3]),
    ]);
  });

  test('parse input4', () => {
    expect(() => {
      const parser = new DimacsParser(input4);
      parser.parse();
    }).toThrow();
  });
});
