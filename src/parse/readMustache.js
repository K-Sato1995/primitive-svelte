import { parseExpressionAt } from 'acorn'

const readMustache = (parser) => {
  const start = parser.idx
  parser.idx += 2

  parser.allowWhitespace()

  const expression = readExpression(parser)

  parser.eat('}}')

  parser.getCurr().children.push({
    start,
    end: parser.idx,
    type: 'MustacheTag',
    expression,
  })
}

const readExpression = (parser) => {
  try {
    const node = parseExpressionAt(parser.template, parser.idx)
    parser.idx = node.end

    return node
  } catch (err) {
    throw new Error(err)
  }
}

export default readMustache
