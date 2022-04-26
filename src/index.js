/*
Todos
- Can insert var in markdown
- Can parse script tag
- data bind
*/

import parse from './parse/index.js'
import generate from './generate/index.js'

const compile = (template) => {
  /*
    const ast = parse(template)
    const code = generate(ast)

    return code
    */
  const ast = parse(template)
  const code = generate(ast, template)
}

const template = `
<h1>hello {{name}}!</h1>
<h1>This is written by {{author}}!</h>
<input bind:value="name"/>

<script>
console.log("Hello World")

export default {
  data: () => ({
    name: 'world'
  })
};
</script>`

compile(template)

/*
const stack = []
each ele of stack is tag.
{
  start: 1,
  end: 25,
  type: 'Element',
  tagName: 'h1',
  attributes: [],
  children: [
    { start: 5, end: 11, type: 'text', data: 'hello ' },
    { start: 11, end: 19, type: 'MustacheTag', expression: [Node] },
    { start: 19, end: 20, type: 'text', data: '!' }
  ]
}
{
  start: 26,
  end: null,
  type: 'Element',
  tagName: 'h1',
  attributes: [],
  children: []
}
{
  start: 26,
  end: null,
  type: 'Element',
  tagName: 'h1',
  attributes: [],
  children: [
    { start: 30, end: 49, type: 'text', data: 'This is written by ' },
    { start: 49, end: 59, type: 'MustacheTag', expression: [Node] }
  ]
}
*/
