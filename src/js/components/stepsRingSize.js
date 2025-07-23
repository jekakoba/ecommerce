export default function stepsRingSize() {
	const parentContainer = document.querySelector('[data-parent-steps-blocks]');
	if (!parentContainer) return;
	const stepBlocks = parentContainer.querySelectorAll('[data-step-block]');
	if (!stepBlocks.length) return;
	let currentIndex = 0;
	parentContainer.addEventListener('click', (e) => {
		if (e.target.closest('[data-step-next]')) {
			currentIndex = (currentIndex + 1) % stepBlocks.length;
			showBlock(currentIndex);
		} else if (e.target.closest('[data-step-start]')) {
			currentIndex = 0;
			showBlock(0);
		}
	});
	showBlock(0);
	function showBlock(index) {
		if (index < 0 || index >= stepBlocks.length) return;
		hideAll();
		stepBlocks[index].removeAttribute('hidden');
		updateClassStep(index);
	}

	function hideAll() {
		stepBlocks.forEach(block => block.setAttribute('hidden', ''));
	}
	function updateClassStep(index) {
		parentContainer.className = parentContainer.className.replace(/step-\d+|step-end/g, '').trim();
		if (index < stepBlocks.length - 1) {
			parentContainer.classList.add(`step-${index + 1}`);
		}
		if (stepBlocks[index].querySelector('[data-step-start]')) {
			parentContainer.classList.add('step-end');
		}
	}
}