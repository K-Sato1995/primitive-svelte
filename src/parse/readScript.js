import { parse, tokenizer } from 'acorn';

function spaces(i) {
  let result = '';
  while (i--) result += ' ';
  return result;
}

// Read js with acorn
export default function readScript(parser, start, attributes) {
  const scriptStart = parser.idx;
  let scriptEnd = null;

  for (const token of tokenizer(parser.remaining())) {
    parser.idx = scriptStart + token.end;
    parser.allowWhitespace();

    if (parser.eat('</script>')) {
      scriptEnd = scriptStart + token.end;
      break;
    }
  }

  const source =
    spaces(scriptStart) + parser.template.slice(scriptStart, scriptEnd);

  let ast;

  try {
    ast = parse(source, {
      ecmaVersion: 8,
      sourceType: 'module',
    });
  } catch (err) {
    parser.acornError(err);
  }

  ast.start = scriptStart;

  return {
    start,
    end: parser.idx,
    attributes,
    content: ast,
  };
}
