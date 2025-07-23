class Parallax {
	constructor(elements) {
		if (elements.length) {
			this.elements = Array.from(elements).map((el) => (
				new Parallax.Each(el, this.options)
			));
		}
	}
	destroyEvents() {
		this.elements.forEach(el => {
			el.destroyEvents();
		})
	}
	setEvents() {
		this.elements.forEach(el => {
			el.setEvents();
		})
	}
}

Parallax.Each = class {
	constructor(parent) {
		this.parent = parent;
		this.elements = this.parent.querySelectorAll('[data-prlx]');
		this.animation = this.animationFrame.bind(this);
		this.offset = 0;
		this.value = 0;
		this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
		// Default coefficient and direction from parent
		this.defaultCoefficient = parent.dataset.prlxCoefficient ? Number(parent.dataset.prlxCoefficient) : 15;
		this.defaultDirection = parent.dataset.prlxDirection ? parent.dataset.prlxDirection + '1' : '-1';
		this.setEvents();
	}
	setEvents() {
		this.animationID = window.requestAnimationFrame(this.animation);
	}
	destroyEvents() {
		window.cancelAnimationFrame(this.animationID);
	}
	animationFrame() {
		const topToWindow = this.parent.getBoundingClientRect().top;
		const heightParent = this.parent.offsetHeight;
		const heightWindow = window.innerHeight;
		const positionParent = {
			top: topToWindow - heightWindow,
			bottom: topToWindow + heightParent,
		}
		const centerPoint = this.parent.dataset.prlxCenter ?
			this.parent.dataset.prlxCenter : 'center';

		if (positionParent.top < 30 && positionParent.bottom > -30) {
			switch (centerPoint) {
				case 'top':
					this.offset = -1 * topToWindow;
					break;
				case 'center':
					this.offset = (heightWindow / 2) - (topToWindow + (heightParent / 2));
					break;
				case 'bottom':
					this.offset = heightWindow - (topToWindow + heightParent);
					break;
			}
		}

		this.value += (this.offset - this.value) / this.smooth;
		this.animationID = window.requestAnimationFrame(this.animation);

		this.elements.forEach(el => {
			const parameters = {
				axis: el.dataset.axis ? el.dataset.axis : 'v',
				// Prioritize child element's direction and coefficient
				direction: el.dataset.direction ? el.dataset.direction + '1' : this.defaultDirection,
				coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : this.defaultCoefficient,
				additionalProperties: el.dataset.properties ? el.dataset.properties : '',
			}
			this.parameters(el, parameters);
		})
	}
	parameters(el, parameters) {
		if (parameters.axis == 'v') {
			el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`
		} else if (parameters.axis == 'h') {
			el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`
		}
	}
}

export function initParallax() {
	if (document.querySelectorAll('[data-prlx-parent]')) {
		return new Parallax(document.querySelectorAll('[data-prlx-parent]'));
	}
}