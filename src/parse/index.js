import readTag from './readTag.js'

class Parser {
    constructor(template) {
        this.stack = []
        this.template = template
        this.idx = 0
    }

    // check if it matches the val of template
    match = (str) => {
        return this.template.slice(this.idx, this.idx + str.length ) === str;
    }
    
    // Do nothing and keep going(Add num of length to index)
    eat = (str) => {
        if(this.match(str)) {
            this.idx += str.length
            return true
        }
        return false
    }
    
    // 
    read = (pattern) => {
        const match = pattern.exec(template.slice(this.idx))
        if(!match || match.idx !== 0) return null
    
        idx += match[0].length
        return match[0]
    }

    // Read till the end of the passed pattern. When there is no match, just returns the template itself
    readUntil = (pattern) => {
        // Regexp exec
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
        const match = pattern.exec(this.template.slice(this.idx))
        return this.template.slice(this.idx, match ? (this.idx += match.index) : this.template.length)
    }

    getCurr = () => {
        const len = stack.length
        return stack[len - 1]
    }


    // just traverse the template
    traverseTemplate = () => {
        while(this.idx <= this.template.length) {
            console.log(this.template[this.idx])
            this.idx += 1
        }
    }
}


const parse = (template) => {
    const parser = new Parser(template)
    const ast = {
        html: {
            start: null,
            end: null,
            type: 'Fragment',
            children: []
        },
        js: null
    }
    parser.stack.push(ast.html);


    parser.traverseTemplate()


    readTag(parser)
}
export default parse

