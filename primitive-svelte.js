import * as svelteCompiler from'svelte/compiler/index.js'
import * as fs from 'fs';

const template = `
<h1>hello {{name}}!</h1>
`;

const { code } = svelteCompiler.compile(template)




fs.writeFile('./generated.js', code, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
  })
  