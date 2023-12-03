import { DimacsParser } from './parser/dimacs';
import { Solver } from './solver/solver';
import { program } from 'commander';

const startTime = Bun.nanoseconds();

program.name('sat-ts').version('0.0.1').arguments('<file>').parse();

const text = await Bun.file(program.args[0]).text();
const parser = new DimacsParser(text);
const result = parser.parse();

const parsedTime = Bun.nanoseconds();

const solver = new Solver(result.clauses);

const res = solver.solve();

const solvedTime = Bun.nanoseconds();

console.log('Finished with result:', res);

console.log(`Parsed in: ${(parsedTime - startTime) / 1e9} seconds`);
console.log(`Solved in: ${(solvedTime - parsedTime) / 1e9} seconds`);
console.log(`Total time: ${(solvedTime - startTime) / 1e9} seconds`);
