import * as svelteCompiler from 'svelte/compiler'

// (1) Svelteの独自記法
const SvelteComponent = `
<script>
  let text = "word";
  console.log(text)

  $: text2 = text + "Extra";
</script>

<h1 class="greeting">Hello {text}</h1>

<style>
  .greeting {
    color: red;
  }
</style>
`

// (2) 独自記法をコンパイルする
const { js, css } = svelteCompiler.compile(SvelteComponent)

// console.log(js.code)
// console.log(css.code)


