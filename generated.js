export default function createComponent ( options ) {
	var component = {};
	var state = {};

	var observers = {
		immediate: Object.create( null ),
		deferred: Object.create( null )
	};

	// universal methods
	function dispatchObservers ( group, state, oldState ) {
		for ( const key in group ) {
			const newValue = state[ key ];
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

		if ( state.name !== oldState.name ) {
			text_0.data = state.name;
		}
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
		element_0.parentNode.removeChild( element_0 );
		
		element_1.parentNode.removeChild( element_1 );
		state = {};
	};

	var element_0 = document.createElement( 'script' );
	options.target.appendChild( element_0 );
	
	element_0.appendChild( document.createTextNode( "const name = \"world\";\n" ) );
	
	var element_1 = document.createElement( 'h1' );
	options.target.appendChild( element_1 );
	
	element_1.appendChild( document.createTextNode( "hello " ) );
	
	var text_0 = document.createTextNode( '' );
	element_1.appendChild( text_0 );
	
	element_1.appendChild( document.createTextNode( "!" ) );

	component.set( options.data );

	return component;
}