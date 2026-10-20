import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const projectDirectory = dirname(fileURLToPath(import.meta.url));
const tasks = [
  ['Task 1', 'tasks/task1.js'],
  ['Task 2', 'tasks/task2.js'],
  ['Task 3', 'tasks/task3.js'],
  ['Task 4', 'tasks/task4.js'],
  ['Task 5', 'tasks/task5/main.js'],
  ['Task 6', 'tasks/task6.js'],
  ['Task 7', 'tasks/task7.js'],
  ['Task 8', 'tasks/task8.js']
];

for (const [name, relativePath] of tasks) {
  console.log(`\n========== ${name} ==========`);

  const result = spawnSync(
    process.execPath,
    [join(projectDirectory, relativePath)],
    { cwd: projectDirectory, stdio: 'inherit' }
  );

  if (result.error) {
    console.error(`Could not run ${name}:`, result.error.message);
    process.exitCode = 1;
    break;
  }

  if (result.status !== 0) {
    console.error(`${name} exited with status ${result.status}.`);
    process.exitCode = result.status ?? 1;
    break;
  }
}
