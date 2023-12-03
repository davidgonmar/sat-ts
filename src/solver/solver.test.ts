import { describe, expect, test } from 'bun:test';
import { DimacsParser } from '@/parser/dimacs';
import { Solver, ResultType } from '@/solver/solver';
import { lstatSync, readdirSync } from 'fs';

describe('Solver', async () => {
  const walkDirectory = async (basePath: string): Promise<string[]> => {
    const fileNames = readdirSync(basePath);
    let filePaths: string[] = [];

    for (const fileName of fileNames) {
      const fullPath = `${basePath}${fileName}`;
      if (lstatSync(fullPath).isDirectory()) {
        const nestedFiles = await walkDirectory(`${fullPath}/`);
        filePaths = filePaths.concat(nestedFiles);
      } else {
        filePaths.push(fullPath);
      }
    }
    return filePaths;
  };

  const runTestCase = (
    text: string,
    fileName: string,
    expected: ResultType,
  ) => {
    return test(fileName, () => {
      const parser = new DimacsParser(text);
      const solver = new Solver(parser.parse().clauses);
      const result = solver.solve();
      expect(result).toBe(expected);
    });
  };

  describe('UNSAT', async () => {
    const basePath = './test-data/cnfs/unsat/';
    const satFiles = await walkDirectory(basePath);

    const fileReadPromises = satFiles.map((filePath) => {
      return Bun.file(filePath).text();
    });

    const satFilesText = await Promise.all(fileReadPromises);

    satFilesText.forEach((text, index) => {
      const fileName = satFiles[index].replace(basePath, '');
      runTestCase(text, fileName, ResultType.UNSAT);
    });
  });

  describe('SAT', async () => {
    const basePath = './test-data/cnfs/sat/';
    const satFiles = await walkDirectory(basePath);

    const fileReadPromises = satFiles.map((filePath) => {
      return Bun.file(filePath).text();
    });

    const satFilesText = await Promise.all(fileReadPromises);

    satFilesText.forEach((text, index) => {
      const fileName = satFiles[index].replace(basePath, '');
      runTestCase(text, fileName, ResultType.SAT);
    });
  });
});
