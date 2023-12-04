import { describe, expect, test } from 'bun:test';
import { DimacsParser } from './dimacs';
import { Clause } from '@/common/clause';

describe('DimacsParser', () => {
  const validCases: Array<[string, Array<Clause>]> = [
    [
      `c This is a comment
    c This is another comment
    p cnf 3 2
    1 2 3 0
    -1 -2 -3 0`,
      [new Clause([1, 2, 3]), new Clause([-1, -2, -3])],
    ],
    [
      `c This is a comment
    c This is another comment
    p cnf 3 2
    1 2 3 0
    -1 -2 -3 0
    c This is another comment`,
      [new Clause([1, 2, 3]), new Clause([-1, -2, -3])],
    ],
    [
      `p cnf 3 2
    1 2 3 0
    -1 -2 -3 0`,
      [new Clause([1, 2, 3]), new Clause([-1, -2, -3])],
    ],
  ];

  test.each(validCases)('parse valid input', (input, expectedClauses) => {
    const parser = new DimacsParser(input);
    const result = parser.parse();
    expect(result.clauses).toEqual(expectedClauses);
  });

  test('throws on invalid input', () => {
    expect(() => {
      const parser = new DimacsParser(`invalid input`);
      parser.parse();
    }).toThrow();
  });
});
