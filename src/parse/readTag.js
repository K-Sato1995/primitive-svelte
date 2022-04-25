const validTagName = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;

const readTag = (parser) => {
    // From one letter after the corrent position
    const start = parser.index++
	const isClosingTag = parser.eat( '/' );



    console.log(isClosingTag)
    const tagName = readTagName(parser)
}

function readTagName (parser) {
	const start = parser.index;
	const name = parser.readUntil( /(\s|\/|>)/ );

    if ( !validTagName.test(name) ) {
		new Error( `Expected valid tag name`, start );
	}

	return name;
}

export default readTag