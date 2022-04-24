import createComponent from "./generated.js";

const component = createComponent({
	target: document.querySelector('body'),
});

component.set({
	name: 'Mundo',
  author: "K-Sato"
});


