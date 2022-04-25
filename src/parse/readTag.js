import { trimStart, trimEnd } from '../utils/index.js';
const validTagName = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;

// const specialTags = {
// 	script: {
// 		read: readScript,
// 		property: 'js'
// 	},

// 	style: {
// 		read: readStyle,
// 		property: 'css'
// 	}
// };

const readTag = (parser) => {
  // From one letter after the corrent position
  const start = parser.idx++;
  const isClosingTag = parser.eat('/');

  const tagName = readTagName(parser);

  parser.allowWhitespace();

  // Todo: read and comment on it
  if (isClosingTag) {
    if (!parser.eat('>')) throw new Error(`Expected '>'`);
    const ele = parser.getCurr();

    if (ele.children.length) {
      const firstChild = ele.children[0];
      const lastChild = ele.children[ele.children.length - 1];

      if (firstChild.type === 'Text') {
        firstChild.data = trimStart(firstChild.data);
        if (!firstChild.data) ele.children.shift();
      }

      if (lastChild.type === 'Text') {
        lastChild.data = trimEnd(lastChild.data);
        if (!lastChild.data) ele.children.pop();
      }
    }

    ele.end = parser.idx;
    parser.stack.pop();
    return null;
  }

  const attributes = [];
  let attribute;

  while ((attribute = readAttribute(parser))) {
    console.log(attribute);
    attributes.push(attribute);
    parser.allowWhitespace();
  }

  // const value = parser.eat( '=' ) ? readAttributeValue( parser ) : true;
};

const readTagName = (parser) => {
  const start = parser.idx;
  const name = parser.readUntil(/(\s|\/|>)/);

  if (!validTagName.test(name)) {
    throw new Error(`Expected valid tag name`, start);
  }

  return name;
};

const readAttribute = (parser) => {
  const start = parser.idx;

  // read till the end of the tag
  const name = parser.readUntil(/(\s|=|\/|>)/);

  // return if there is no attribute
  if (!name) return null;

  // Todo: handleEventHandler
  if (/^bind:/.test(name)) {
    // trim "="
    parser.eat('=');
    // name.slice(5) = value
    return readBind(parser, start, name.slice(5));
  }
};

const readBind = (parser, start, name) => {
  const quoteMark = parser.eat(`'`) ? `'` : parser.eat(`"`) ? `"` : null;

  const value = parser.read(
    /([a-zA-Z_$][a-zA-Z0-9_$]*)(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*/,
  );

  if (!value) throw new Error(`Expected valid property name`);

  if (quoteMark) {
    parser.eat(quoteMark);
  }

  return {
    start,
    end: parser.idx,
    type: 'Binding',
    name,
    value,
  };
};

export default readTag;
