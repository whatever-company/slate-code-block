import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Slate from 'slate'
import _hyperprint from '@zarv1k/slate-hyperprint'
import _EditCode from '../lib/index.js'

const hyperprint = _hyperprint.default || _hyperprint
const EditCode = _EditCode.default || _EditCode

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PLUGIN = EditCode()

function deserializeValue(value) {
  return new Slate.Editor({
    plugins: [PLUGIN],
    value: Slate.Value.fromJSON({
      selection: value.selection,
      document: value.document,
    }),
  })
}

describe('slate-edit-code', () => {
  const entries = fs.readdirSync(__dirname)

  for (const test of entries) {
    if (test[0] === '.' || path.extname(test).length > 0) continue

    it(test, async () => {
      Slate.KeyUtils.resetGenerator()
      const dir = path.resolve(__dirname, test)

      const input = (await import(path.resolve(dir, 'input.js'))).default
      const expectedPath = path.resolve(dir, 'expected.js')
      const expected = fs.existsSync(expectedPath)
        ? (await import(expectedPath)).default
        : null

      const runChange = (await import(path.resolve(dir, 'change.js'))).default

      const newChange = runChange(PLUGIN, deserializeValue(input))

      if (expected) {
        const newDoc = hyperprint(newChange.value.document, { strict: true })
        assert.equal(newDoc, hyperprint(expected.document, { strict: true }))
      }
    })
  }
})
