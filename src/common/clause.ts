import { Literal, LiteralOrAssignedLiteral } from '@/common/literal';

/**
 * A clause is a disjunction of literals.
 * For example, (a ∨ b ∨ c) and (a ∨ -b ∨ c) are clauses.
 * It can also be represented as {a, b, c}.
 */
export class Clause {
  /**
   * A literal being a boolean value means that it has been assigned to a boolean value.
   */
  public literals: Array<LiteralOrAssignedLiteral>;

  constructor(literals: Array<LiteralOrAssignedLiteral>) {
    this.literals = literals;
  }

  /**
   * Returns an independent copy of the clause.
   */
  public clone(): Clause {
    return new Clause(this.literals);
  }

  /**
   * Returns true if the clause contains the literal passed in.
   */
  public containsLiteral(literal: Literal) {
    return this.literals.includes(literal);
  }

  /**
   * Substitutes a literal by a boolean value, and its negation by the negation of the boolean value.
   */
  public assignLiteral(literal: Literal, value: boolean) {
    this.literals = this.literals.map((l) =>
      l === literal ? value : l === -literal ? !value : l,
    );
  }

  /**
   * Returns a unit literal if this is a unit clause, null otherwise.
   */
  public get unitLiteral(): Literal | null {
    if (this.isSatisfied) {
      return null;
    }
    if (this.unassignedLiterals.length === 1) {
      return this.unassignedLiterals[0];
    }
    return null;
  }

  /**
   * True if the clause is satisfied (at least one literal is true).
   */
  public get isSatisfied(): boolean {
    return this.literals.some((literal) => literal === true);
  }

  /**
   * True if the clause is unsatisfied (all literals are false).
   */
  public get isUnsatisfiable(): boolean {
    return this.literals.every((literal) => literal === false);
  }

  /**
   * Returns a list of unasigned literals.
   */
  public get unassignedLiterals(): Literal[] {
    return this.literals.filter(
      (literal) => typeof literal === 'number',
    ) as Literal[];
  }
}
