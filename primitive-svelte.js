import * as svelteCompiler from'svelte/compiler/index.js'
import * as fs from 'fs';

const template = `
<script>
const name = "world";
</script>

<h1>hello {{name}}!</h1>
`;

const { code } = svelteCompiler.compile(template)

console.log(code)



fs.writeFile('./generated.js', code, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
  })
  