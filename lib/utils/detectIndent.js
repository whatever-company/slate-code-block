/**
 * MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

https://github.com/sindresorhus/detect-indent
*/

// Detect either spaces or tabs but not both to properly handle tabs for indentation and spaces for alignment
const INDENT_REGEX = /^(?:( )+|\t+)/

function getMostUsed(indents) {
  let result = 0
  let maxUsed = 0
  let maxWeight = 0

  for (const [key, [usedCount, weight]] of indents) {
    if (usedCount > maxUsed || (usedCount === maxUsed && weight > maxWeight)) {
      maxUsed = usedCount
      maxWeight = weight
      result = key
    }
  }

  return result
}

export default string => {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  // Remember the size of previous line's indentation
  let previousSize = 0
  let previousIndentType

  // Indents key (ident type + size of the indents/unindents)
  let key

  // Remember how many indents/unindents have occurred for a given size and how many lines follow a given indentation.
  // The key is a concatenation of the indentation type (s = space and t = tab) and the size of the indents/unindents.
  //
  // indents = {
  //    t3: [1, 0],
  //    t4: [1, 5],
  //    s5: [1, 0],
  //   s12: [1, 0],
  // }
  const indents = new Map()

  for (const line of string.split(/\n/g)) {
    if (!line) {
      // Ignore empty lines
      continue
    }

    let indent
    let indentType
    let weight
    let entry
    const matches = line.match(INDENT_REGEX)

    if (matches === null) {
      previousSize = 0
      previousIndentType = ''
    } else {
      indent = matches[0].length

      if (matches[1]) {
        indentType = 's'
      } else {
        indentType = 't'
      }

      if (indentType !== previousIndentType) {
        previousSize = 0
      }

      previousIndentType = indentType

      weight = 0

      const indentDifference = indent - previousSize
      previousSize = indent

      // Previous line have same indent?
      if (indentDifference === 0) {
        weight++
        // We use the key from previous loop
      } else {
        key =
          indentType +
          String(indentDifference > 0 ? indentDifference : -indentDifference)
      }

      // Update the stats
      entry = indents.get(key)

      if (entry === undefined) {
        entry = [1, 0] // Init
      } else {
        entry = [++entry[0], entry[1] + weight]
      }

      indents.set(key, entry)
    }
  }

  const result = getMostUsed(indents)

  let amount = 0
  let type
  let indent = ''

  if (result !== 0) {
    amount = Number(result.slice(1))

    if (result[0] === 's') {
      type = 'space'
      indent = ' '.repeat(amount)
    } else {
      type = 'tab'
      indent = '\t'.repeat(amount)
    }
  }

  return {
    amount,
    type,
    indent
  }
}
