# 💡sat-ts

## Introduction

A DPLL-based SAT solver written in TypeScript, powered by Bun.

## Usage

### Requirements

You need to have Bun installed on your system. You can find more information at https://bun.sh/.

### Running the solver

First, clone the repository and install dependencies:

```bash
git clone https://github.com/davidgonmar/sat-ts.git
cd sat-ts
bun install
```

Then, you can run the solver with:

```bash
bun sat-ts <path-to-cnf-file>
```

The program accepts CNF files in the DIMACS format.

### Example

```bash
bun sat-ts path/to/file.cnf

# Example output
Finished with result: SAT
Parsed in: 0.123 seconds
Solved in: 0.456 seconds
Total time: 0.579 seconds
```

### Testing

Tests can be run with:

```bash
bun test
```

Tests for the solver use example .cnf files from the [SATLIB Benchmark Problems](https://www.cs.ubc.ca/~hoos/SATLIB/benchm.html) mainly.

### Linting and formatting

The project uses ESLint for linting. It can be run with:

```bash
bun lint
bun format
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
