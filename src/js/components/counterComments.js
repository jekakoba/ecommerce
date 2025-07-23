export default function counterComments() {
	const countersList = document.querySelectorAll('[data-counter]');
	if (countersList.length === 0) return
	document.addEventListener('click', function (e) {
		const button = e.target.closest('[data-counter]');
		if (!button) {
			console.log('Click outside data-counter');
			return;
		}
		const wrapper = button.parentElement;
		if (!wrapper) {
			console.error('Parent wrapper not found');
			return;
		}
		if (wrapper.classList.contains('anim-counter')) {
			console.log('Animation still active, ignoring click');
			return;
		}
		const counterElement = wrapper.querySelector('[data-counter-value]');
		if (!counterElement) {
			console.error('Counter element not found');
			return;
		}
		let count = parseInt(counterElement.textContent) || 0;
		counterElement.textContent = count + 1;
		console.log(`Counter updated to: ${count + 1}`);
		wrapper.classList.add('anim-counter');
		wrapper.addEventListener('animationend', function handler() {
			wrapper.classList.remove('anim-counter');
			console.log('Animation ended, anim-counter removed');
		}, { once: true });

		setTimeout(() => {
			if (wrapper.classList.contains('anim-counter')) {
				wrapper.classList.remove('anim-counter');
				console.warn('Animationend did not fire, removed anim-counter via timeout');
			}
		}, 800);
	});
}