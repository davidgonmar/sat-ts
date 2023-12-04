import { describe, expect, test } from 'bun:test';
import { DimacsParser } from '@/parser/dimacs';
import { Solver, ResultType } from '@/solver/solver';
import { lstatSync, readdirSync } from 'fs';

describe('Solver', () => {
  const walkDirectory = (basePath: string): string[] => {
    const fileNames = readdirSync(basePath);
    let filePaths: string[] = [];

    for (const fileName of fileNames) {
      const fullPath = `${basePath}${fileName}`;
      if (lstatSync(fullPath).isDirectory()) {
        const nestedFiles = walkDirectory(`${fullPath}/`);
        filePaths = filePaths.concat(nestedFiles);
      } else {
        filePaths.push(fullPath);
      }
    }
    return filePaths;
  };

  const runTestCase = (
    _fileName: string,
    text: string,
    expected: ResultType,
  ) => {
    const parser = new DimacsParser(text);
    const solver = new Solver(parser.parse().clauses);
    const result = solver.solve();
    expect(result).toBe(expected);
  };

  const createTestCases = async (basePath: string, expected: ResultType) => {
    const files = walkDirectory(basePath);
    return await Promise.all(
      files.map(async (filePath) => {
        const text = await Bun.file(filePath).text();
        const fileName = filePath.replace(basePath, '');
        return [fileName, text, expected as string];
      }),
    );
  };

  describe('UNSAT', async () => {
    const basePath = './test-data/cnfs/unsat/';
    const testCases = await createTestCases(basePath, ResultType.UNSAT);
    test.each(testCases)('%s', runTestCase as any);
  });

  describe('SAT', async () => {
    const basePath = './test-data/cnfs/sat/';
    const testCases = await createTestCases(basePath, ResultType.SAT);
    test.each(testCases)('%s', runTestCase as any);
  });
});
