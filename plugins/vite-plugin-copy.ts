import { PluginOption } from 'vite';
import { executeCommand } from './cmd.js';

export default function VitePluginCopy(globs: string[]): PluginOption {
  return {
    name: 'vite-plugin-copy',
    async writeBundle(options) {
      const outDir = options.dir || 'dist';
      const command = `
        cp --force --dereference --recursive --verbose ${globs.join(' ')} --target-directory=${outDir}
      `;

      await executeCommand(command);
    },
  };
}
