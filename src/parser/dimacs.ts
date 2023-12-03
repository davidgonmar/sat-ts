import { Clause } from '@/common/clause';

/**
 * Parses a string in DIMACS format.
 * See https://people.sc.fsu.edu/~jburkardt/data/cnf/cnf.html
 */
export class DimacsParser {
  private currentLineIndex = 0;
  private readonly lines: string[];

  private readonly theoreticalNumberOfVariables: number;
  private readonly theoreticalNumberOfClauses: number;

  private readonly clauses: Array<Clause> = [];
  private readonly variables: Set<number> = new Set();

  constructor(private readonly input: string) {
    try {
      // Separate lines
      this.lines = this.input.split('\n').map((line) => line.trim());
      this.skipRedundantLines();

      // Parse header
      const firstLine = this.currentLine;
      if (firstLine === null) {
        throw new Error('Invalid input');
      }
      const [p, cnf, numberOfVariables, numberOfClauses] = firstLine
        .split(/\s+/)
        .map((s) => s.trim());
      if (p !== 'p' || cnf !== 'cnf') {
        throw new Error('Invalid input. Expected "p cnf". Got: ' + firstLine, {
          cause: 'p cnf',
        });
      }
      this.theoreticalNumberOfVariables = parseInt(numberOfVariables);
      this.theoreticalNumberOfClauses = parseInt(numberOfClauses);
      this.currentLineIndex++;
    } catch (e) {
      if (e instanceof Error && e?.cause === 'p cnf') {
        throw e;
      }
      throw new Error(`Invalid input. Make sure it is in DIMACS format`);
    }
  }

  /**
   * Returns the current line, or null if there is no current line. Does not skip redundant lines.
   */
  private get currentLine(): string | null {
    return this.lines.length > this.currentLineIndex
      ? this.lines[this.currentLineIndex]
      : null;
  }

  /**
   * Skips all comment lines and returns the number of lines skipped.
   * @returns The number of lines skipped.
   */
  private skipCommentLines(): number {
    let i = 0;
    while (this.currentLine?.startsWith('c')) {
      this.currentLineIndex++;
      i++;
    }
    return i;
  }

  /**
   * Skips all empty lines and returns the number of lines skipped.
   * @returns The number of lines skipped.
   */
  private skipEmptyLines(): number {
    let i = 0;
    while (this.currentLine?.replace(/\s/g, '') === '') {
      this.currentLineIndex++;
      i++;
    }
    return i;
  }

  /**
   * Skips all redundant lines (comment and empty) and returns the number of lines skipped.
   * @returns The number of lines skipped.
   */
  private skipRedundantLines(): void {
    while (this.skipCommentLines() + this.skipEmptyLines() > 0) {}
  }

  /**
   * Parses the current line and adds it to the clauses.
   */
  private step(): void {
    this.skipRedundantLines();
    const currentLine = this.currentLine;
    if (currentLine === null) {
      throw new Error('Invalid input');
    }
    const lineLiterals = currentLine.split(/\s+/).map((s) => s.trim());
    const numberLiterals = lineLiterals
      .map((s) => parseInt(s))
      .map((n) => {
        if (isNaN(n)) {
          throw new Error('Invalid input. Expected a number. Got: ' + n);
        }
        return n;
      })
      .filter((n) => n); // filter out 0
    const clause = new Clause(numberLiterals);
    for (const literal of clause.literals) {
      this.variables.add(Math.abs(literal as number));
    }

    this.clauses.push(clause);
    this.currentLineIndex++;
  }

  /**
   * Returns true if the parser is done.
   */
  private get isDone(): boolean {
    return (
      this.clauses.length === this.theoreticalNumberOfClauses ||
      this.currentLine === null
    );
  }

  /**
   * Parses the input and returns an object containing the clauses and the symbols.
   */
  public parse() {
    while (!this.isDone) {
      this.step();
    }
    if (this.clauses.length !== this.theoreticalNumberOfClauses) {
      throw new Error(
        `Invalid input. Expected ${this.theoreticalNumberOfClauses} clauses, got ${this.clauses.length} clauses.`,
      );
    }
    if (this.variables.size !== this.theoreticalNumberOfVariables) {
      throw new Error(
        `Invalid input. Expected ${this.theoreticalNumberOfVariables} variables, got ${this.variables.size} variables.`,
      );
    }
    return {
      clauses: this.clauses,
      symbols: this.variables,
    };
  }
}
