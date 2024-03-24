import { PluginOption } from 'vite';
import { executeCommand } from './cmd.js';

export default function VitePluginGenerateDeclarations(globs: string[]): PluginOption {
  return {
    name: 'vite-plugin-declaration',
    async writeBundle(options) {
      const outDir = options.dir || 'dist';

      await executeCommand(`
        tsc --declaration --emitDeclarationOnly --skipLibCheck --allowJs --outDir ${outDir} ${globs.join(' ')}
      `);

      const tsfiles = globs.filter((filename) => filename.endsWith('.d.ts')).join(' ');

      if (tsfiles.length) {
        await executeCommand(`cp ${tsfiles} ${outDir}`);
      }
    },
  };
}
