/*
Todos
- Can insert var in markdown
- Can parse script tag
*/

import parse from './parse/index.js'

const compile = (template) => {
    /*
    const ast = parse(template)
    const code = generate(ast)

    return code
    */
    const ast = parse(template)

}

const template = `
<h1>hello {{name}}!</h1>
<h1>This is written by {{author}}!</h>

<script>
console.log("Hello World")

const hello = () => {
  console.log("ONCLICK")
}
export default {
  data: () => ({
    name: 'world'
  })
};
</script>
`;

compile(template)
