import { transformSync } from 'esbuild'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export async function load(url, context, nextLoad) {
  if (url.endsWith('.js') && !url.includes('node_modules')) {
    const path = fileURLToPath(url)
    const source = readFileSync(path, 'utf8')

    if (source.includes('@jsx')) {
      const { code } = transformSync(source, {
        loader: 'jsx',
        format: 'esm',
        sourcefile: path,
      })
      return { format: 'module', shortCircuit: true, source: code }
    }
  }

  return nextLoad(url, context)
}
