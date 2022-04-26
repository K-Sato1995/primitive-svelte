
console.log("Hello World")

const template = {
  data: () => ({
    name: 'world'
  })
};

function renderMainFragment ( component, target ) {
	var h1 = document.createElement( 'h1' );
	
	h1.appendChild( document.createTextNode( "hello " ) );
	
	var text = document.createTextNode( '' );
	var text_value = '';
	h1.appendChild( text );
	
	h1.appendChild( document.createTextNode( "!" ) );
	
	target.appendChild( h1 );
	
	target.appendChild( document.createTextNode( "\n" ) );
	
	var h11 = document.createElement( 'h1' );
	
	h11.appendChild( document.createTextNode( "This is written by " ) );
	
	var text1 = document.createTextNode( '' );
	var text1_value = '';
	h11.appendChild( text1 );
	
	h11.appendChild( document.createTextNode( "!" ) );
	
	target.appendChild( h11 );
	
	target.appendChild( document.createTextNode( "\n" ) );
	
	var input = document.createElement( 'input' );
	var input_updating = false;
	
	function inputChangeHandler () {
		input_updating = true;
		component.set({ name: input.value });
		input_updating = false;
	}
	
	input.addEventListener( 'input', inputChangeHandler, false );
	
	target.appendChild( input );

	return {
		update: function ( root ) {
			if ( root.name !== text_value ) {
				text_value = root.name;
				text.data = text_value;
			}
			
			if ( root.author !== text1_value ) {
				text1_value = root.author;
				text1.data = text1_value;
			}
			
			if ( !input_updating ) input.value = root.name
		},

		teardown: function () {
			h1.parentNode.removeChild( h1 );
			
			h11.parentNode.removeChild( h11 );
			
			input.removeEventListener( 'input', inputChangeHandler, false );
			input.parentNode.removeChild( input );
		}
	};
}

export default function createComponent ( options ) {
	var component = {};
	var state = {};

	var observers = {
		immediate: Object.create( null ),
		deferred: Object.create( null )
	};

	function dispatchObservers ( group, newState, oldState ) {
		for ( const key in group ) {
			if ( !( key in newState ) ) continue;

			const newValue = newState[ key ];
			const oldValue = oldState[ key ];

			if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

			const callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( let i = 0; i < callbacks.length; i += 1 ) {
				callbacks[i].call( component, newValue, oldValue );
			}
		}
	}

	component.get = function get ( key ) {
		return state[ key ];
	};

	component.set = function set ( newState ) {
		const oldState = state;
		state = Object.assign( {}, oldState, newState );
		
		dispatchObservers( observers.immediate, newState, oldState );
		mainFragment.update( state );
		dispatchObservers( observers.deferred, newState, oldState );
	};

	component.observe = function ( key, callback, options = {} ) {
		const group = options.defer ? observers.deferred : observers.immediate;

		( group[ key ] || ( group[ key ] = [] ) ).push( callback );
		if ( options.init !== false ) callback( state[ key ] );

		return {
			cancel () {
				const index = group[ key ].indexOf( callback );
				if ( ~index ) group[ key ].splice( index, 1 );
			}
		};
	};

	component.teardown = function teardown () {
		mainFragment.teardown();
		mainFragment = null;

		state = {};

		
	};

	let mainFragment = renderMainFragment( component, options.target );
	component.set( Object.assign( template.data(), options.data ) );

	

	return component;
}