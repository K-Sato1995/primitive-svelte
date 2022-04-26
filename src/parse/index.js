import readTag from './readTag.js'
import readMustache from './readMustache.js'

class Parser {
  constructor(template) {
    this.stack = [] // Array of nodes
    this.template = template
    this.idx = 0
    this.ast = {
        html: {
			start: null,
			end: null,
			type: 'Fragment',
			children: []
		},
        js: null
    }
  }

  // check if it matches the val of template
  match = (str) => {
    return this.template.slice(this.idx, this.idx + str.length) === str
  }

  // Do nothing and keep going(Add num of length to index)
  eat = (str) => {
    if (this.match(str)) {
      this.idx += str.length
      return true
    }
    return false
  }

  // Read the matched pattern
  read = (pattern) => {
    const match = pattern.exec(this.template.slice(this.idx))
    if (!match || match.index !== 0) return null

    this.idx += match[0].length
    return match[0]
  }

  // Read till the end of the passed pattern. When there is no match, just returns the template itself
  readUntil = (pattern) => {
    // Regexp exec
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    const match = pattern.exec(this.template.slice(this.idx))
    return this.template.slice(
      this.idx,
      match ? (this.idx += match.index) : this.template.length,
    )
  }

  getCurr = () => {
    const len = this.stack.length
    return this.stack[len - 1]
  }

  readText = () => {
    const start = this.idx

    let data = ''

    // Read data besides < or {{
    while (
      this.idx < this.template.length &&
      !this.match('<') &&
      !this.match('{{')
    ) {
      data += this.template[this.idx++]
    }

    const node = this.getCurr()

    node.children.push({
      start,
      end: this.idx,
      type: 'text',
      data,
    })
  }

  remaining = () => {
    return this.template.slice(this.idx)
  }

  allowWhitespace() {
    while (
      this.idx < this.template.length &&
      /\s/.test(this.template[this.idx])
    ) {
      this.idx++
    }
  }

  // just traverse the template
  traverseTemplate = () => {
    while (this.idx <= this.template.length) {
      console.log(this.template[this.idx])
      this.idx += 1
    }
  }
}

const parse = (template) => {
  const parser = new Parser(template)
  parser.stack.push(parser.ast.html)

  // fragment = tag || mustach || text
  let state = fragment

  // Run readTag, readMustache or readText(each of them adds num to inx)
  while (parser.idx < parser.template.length) {
    state = state(parser) || fragment
  }

  return parser.ast
}

const fragment = (parser) => {
  if (parser.match('<')) {
    // return readTag;
    return readTag(parser)
  }

  if (parser.match('{{')) {
    // return mustache;
    return readMustache(parser)
  }

  return parser.readText
}

export default parse
