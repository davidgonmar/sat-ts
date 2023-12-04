import { Literal, LiteralOrAssignedLiteral } from '@/common/literal';

export type ClauseValue = boolean | Array<LiteralOrAssignedLiteral>;

/**
 * A clause is a disjunction of literals.
 * For example, (a ∨ b ∨ c) and (a ∨ -b ∨ c) are clauses.
 * It can also be represented as {a, b, c}.
 *
 * The truth value of a clause is true if at least one of its literals is true, undecided
 * if at least one of its literals is not assigned, and false if all of its literals are false.
 */
export class Clause {
  private _value: ClauseValue;

  /**
   * Constructs a clause from an array of literals or a boolean value.
   */
  constructor(value: ClauseValue) {
    this._value = value;
  }

  /**
   * Returns the value of the clause.
   * It can be a boolean value (if the clause is decided) or an array of literals/assigned literals (if the clause is undecided)
   */
  public get value(): ClauseValue {
    return this._value;
  }

  /**
   * Returns an independent copy of the clause.
   */
  public clone(): Clause {
    return new Clause(
      typeof this._value === 'boolean' ? this._value : [...this._value],
    );
  }

  /**
   * Substitutes a literal by a boolean value, and its negation by the negation of the boolean value.
   * Also updates the value of the clause in case it becomes decided.
   */
  public assignLiteral(literal: Literal, value: boolean): void {
    if (typeof this._value === 'boolean') {
      return;
    }
    // We will keep track of whether we found a non-assigned literal.
    // If we don't find one, then the clause is decided.
    let foundNonAssignedLiteral = false;
    for (let i = 0; i < this._value.length; i++) {
      // A clause is true if at least one of its literals is true
      // Since assigning a literal to true makes the clause true, we can just make the clause true and return
      if (this._value[i] === literal && value) {
        this._value = true;
        return;
      } else if (this._value[i] === -literal && !value) {
        this._value = true;
        return;
        // Next two cases, just assign the literal but it will not make the clause true
      } else if (this._value[i] === literal) {
        this._value[i] = value;
      } else if (this._value[i] === -literal) {
        this._value[i] = !value;
      } else if (typeof this._value[i] !== 'boolean') {
        foundNonAssignedLiteral = true;
      }
    }
    // As mentioned above, if we didn't find a non-assigned literal, the clause is decided.
    // Since we already checked for the case where the clause is true, it must be false.
    if (!foundNonAssignedLiteral) {
      this._value = false;
    }
    // Else, it is left undecided (array of literals/assigned literals)
  }

  /**
   * Returns a unit literal if this is a unit clause, null otherwise.
   * A unit clause is a clause with only one non-assigned literal.
   * If the clause is decided, returns null.
   */
  public get unitLiteral(): Literal | null {
    if (typeof this.value === 'boolean') {
      return null;
    }
    let unitLiteral: Literal | null = null;
    for (const literal of this.value) {
      if (typeof literal !== 'boolean') {
        if (unitLiteral !== null) {
          return null;
        }
        unitLiteral = literal;
      }
    }
    return unitLiteral;
  }
}
