import walkHtml from './walkHtml.js'

const generate = (ast, template) => {
  const { html, js } = ast

  const renderers = []

  let current = {
    useAnchor: false,
    name: 'renderMainFragment',
    target: 'target',

    initStatements: [],
    updateStatements: [],
    teardownStatements: [],

    contexts: {},
    indexes: {},

    contextChain: ['root'],
    indexNames: {},
    listNames: {},
    counter: counter(),
    parent: null,
  }

  html.children.forEach((child) => {
    // walkHtml(child, visitors)
    walkHtml(child, {
      Comment: {},
      Element: {
        enter(node) {
          const name = current.counter(node.tagName)

          const initStatements = [
            `var ${name} = document.createElement( '${node.tagName}' );`,
          ]
          const updateStatements = []

          // Set dynamic stuff based on the attribute
          node.attributes.forEach((attribute) => {
            if (attribute.type === 'Binding') {
              //   createBinding()
            }
          })
          current.initStatements.push(initStatements.join('\n'))

          if (updateStatements.length) {
            current.updateStatements.push(updateStatements.join('\n'))
          }

          current = Object.assign({}, current, {
            target: name,
            parent: current,
          })
        },
      },
      Text: {
        enter(node) {
            // deintent is not defined
          current.initStatements.push(deindent`
                ${
                  current.target
                }.appendChild( document.createTextNode( ${JSON.stringify(
            node.data,
          )} ) );
            `)
        },
      },
      MustacheTag: {},
    })
  })
}

// create id
const counter = () => {
  const counts = {}

  return function (label) {
    if (label in counts) {
      return `${label}${counts[label]++}`
    }

    counts[label] = 1
    return label
  }
}

export default generate
