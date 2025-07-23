

/*
The subject that will move behind the mouse indicate the attribute of the Data-Prlx-Mouse.

// =========
If you want additional settings - specify

Attribute											The default value
-------------------------------------------------------------------------------------------------------------------
data-prlx-cx="coefficient_x"					100							зValue greater - less than a percentage of shift
data-prlx-cy="the ratio_y"					100							Value greater - less than a percentage of shift
data-prlx-dxr																		against the axis X
data-prlx-dyr																		against the axis Y
data-prlx-a="Animation speed"				50								More value is more speed

// =========
If you need to read mouse motion in the parent block - so the parent indicate the attribute data-prlx-mouse-wrapper

If in Paralax picture - stretch it on >100%. 
For example:
	width: 130%;
	height: 130%;
	top: -15%;
	left: -15%;
*/
class MousePRLX {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			logging: true,
		}
		this.config = Object.assign(defaultConfig, props);
		if (this.config.init) {
			const paralaxMouse = document.querySelectorAll('[data-prlx-mouse]');
			if (paralaxMouse.length) {
				this.paralaxMouseInit(paralaxMouse);
			}
		}
	}
	paralaxMouseInit(paralaxMouse) {
		paralaxMouse.forEach(el => {
			const paralaxMouseWrapper = el.closest('[data-prlx-mouse-wrapper]');

			// coefficient. X 
			const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
			// coefficient У 
			const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
			// Х
			const directionX = el.hasAttribute('data-prlx-dxr') ? -1 : 1;
			// У
			const directionY = el.hasAttribute('data-prlx-dyr') ? -1 : 1;
			// Animation speed
			const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;


			// Announcement of variables
			let positionX = 0, positionY = 0;
			let coordXprocent = 0, coordYprocent = 0;

			setMouseParallaxStyle();

			// Check for a parent in which the mouse position will be read
			if (paralaxMouseWrapper) {
				mouseMoveParalax(paralaxMouseWrapper);
			} else {
				mouseMoveParalax();
			}

			function setMouseParallaxStyle() {
				const distX = coordXprocent - positionX;
				const distY = coordYprocent - positionY;
				positionX = positionX + (distX * paramAnimation / 1000);
				positionY = positionY + (distY * paramAnimation / 1000);
				el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0) rotate(0.02deg);`;
				requestAnimationFrame(setMouseParallaxStyle);
			}
			function mouseMoveParalax(wrapper = window) {
				wrapper.addEventListener("mousemove", function (e) {
					const offsetTop = el.getBoundingClientRect().top + window.scrollY;
					if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
						// Getting the width and height of the block
						const parallaxWidth = window.innerWidth;
						const parallaxHeight = window.innerHeight;
						// Zero in the middle
						const coordX = e.clientX - parallaxWidth / 2;
						const coordY = e.clientY - parallaxHeight / 2;
						// We get interest
						coordXprocent = coordX / parallaxWidth * 100;
						coordYprocent = coordY / parallaxHeight * 100;
					}
				});
			}
		});
	}
}
export function initMousePRLX() {
	return new MousePRLX({});
}



