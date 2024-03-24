import { spawn } from 'node:child_process';

export function executeCommand(command: string) {
  return new Promise((resolve, reject) => {
    const trimmedCommand = command.trim();
    const [cmd, ...args] = trimmedCommand.split(' ');

    process.stdout.write(`Executing ${trimmedCommand}\n`);

    const exec = spawn(cmd, args, { shell: true });

    exec.stdout.on('data', (data) => process.stdout.write(data));
    exec.stderr.on('data', (data) => process.stderr.write(data));
    exec.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        process.stderr.write(`Command failed with code ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}
