import { Clause } from '@/common/clause';
import { Literal } from '@/common/literal';

export enum ResultType {
  SAT = 'SAT',
  UNSAT = 'UNSAT',
}

/**
 * Solver class for solving SAT problems using the DPLL algorithm.
 */
export class Solver {
  private branchingStack: Clause[][] = [];

  constructor(public clauses: Clause[]) {}

  /**
   * Returns a deep copy of the current clauses.
   */
  private copyClauses() {
    return this.clauses.map((clause) => clause.clone());
  }

  /**
   * Performs an assignment of a literal to a boolean value.
   * It will assign the value to the literal and assign the negation of the value to the negation of the literal.
   * @param literal The literal to assign.
   * @param value The value to assign to the literal.
   *
   */
  private assign(literal: Literal, value: boolean) {
    const newClauses: Clause[] = [];
    for (const clause of this.clauses) {
      clause.assignLiteral(literal, value);
      if (clause.isSatisfied) {
        continue;
      }
      newClauses.push(clause.clone());
    }
    this.clauses = newClauses;
  }

  /**
   * Performs unit propagation on the current clauses.
   * @returns true if at least one unit propagation was performed, false otherwise.
   */
  private unitPropagation(): boolean {
    let didPropagate = false;
    for (const clause of this.clauses) {
      const unitLiteral = clause.unitLiteral;
      if (unitLiteral === null) {
        continue;
      }
      didPropagate = true;
      this.assign(unitLiteral, true);
    }
    return didPropagate;
  }

  /**
   * Heuristically picks a literal to branch on based on the number of times it appears in unsatisfied clauses.
   */
  private pickLiteral() {
    const mostUsed: Map<Literal, number> = new Map();
    // We need to find a literal that is not assigned from a clause that is not satisfied
    for (const clause of this.clauses.filter(
      (clause) => !clause.isSatisfied && !clause.isUnsatisfiable,
    )) {
      for (const literal of clause.unassignedLiterals) {
        const count = mostUsed.get(literal) || 0;
        mostUsed.set(literal, count + 1);
      }
    }
    return [...mostUsed.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * Takes a branch on a literal.
   * @param literal The literal to branch on.
   * @param firstBranch True if this is the first branch on the literal. False if
   * we already branched on the negation of the literal and just backtracked.
   */
  private branch(literal: Literal, firstBranch: boolean) {
    // We only want to save the state of the clauses if we are branching on the first time for a literal
    if (firstBranch) {
      this.branchingStack.push(this.copyClauses());
    }
    this.assign(literal, true);
  }

  /**
   * Backtracks to most recent branching point, returning the clauses to the state they were in at that point.
   */
  private backTrack() {
    const state = this.branchingStack.pop();
    if (state === undefined) {
      throw new Error('Unexpected undefined state');
    }
    this.clauses = state;
  }

  /**
   * True if all clauses are satisfied.
   */
  private get isSatisfiable() {
    return this.clauses.every((clause) => clause.isSatisfied);
  }

  /**
   * True if at least one clause is unsatisfied.
   */
  private get isUnsatisfiable() {
    return this.clauses.some((clause) => clause.isUnsatisfiable);
  }

  /**
   * Performs one step of the DPLL algorithm.
   */
  private step(): ResultType {
    // Base cases
    if (this.isSatisfiable) {
      return ResultType.SAT;
    }
    if (this.isUnsatisfiable) {
      return ResultType.UNSAT;
    }

    // If we propagated, we need to check again if we are done
    if (this.unitPropagation()) {
      return this.step();
    }

    // If we are not done, we need to branch
    const firstLiteral = this.pickLiteral();

    this.branch(firstLiteral, true);

    const isSat = this.step();

    // If the first branch was satisfiable, we are done, but if not, try the other branch
    if (isSat === ResultType.SAT) {
      return ResultType.SAT;
    } else {
      this.backTrack();
      this.branch(-firstLiteral, false);
      return this.step();
    }
  }

  /**
   * Solves the SAT problem associated with the class.
   */
  public solve(): ResultType {
    return this.step();
  }
}
