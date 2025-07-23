import Swiper from 'swiper';
import { Navigation, EffectFade, Pagination } from 'swiper/modules';

function configurePagination(sliderEl, config, slides) {
	if (slides.length > 1) {
		config.modules = config.modules || [];
		config.modules.push(Pagination);
		config.pagination = {
			el: sliderEl.querySelector('.swiper-pagination') || sliderEl.querySelector('.swiper-products-pagination'),
			clickable: true,
			type: 'bullets',
		};
	} else {
		const paginationEl = sliderEl.querySelector('.swiper-pagination') || sliderEl.querySelector('.swiper-products-pagination');
		if (paginationEl) paginationEl.remove();
	}
}

function initSliders() {
	if (document.querySelectorAll('.swiper-slide').length === 0) return;
	if (document.querySelectorAll('[data-advantages]').length > 0) {
		document.querySelectorAll('[data-advantages]').forEach(sliderAdvantages => {
			const slides = sliderAdvantages.querySelectorAll('.swiper-slide');
			const config = {
				observer: true,
				observeParents: true,
				slidesPerView: 4.238,
				spaceBetween: 12,
				speed: 400,
				grabCursor: true,
				breakpoints: {
					320: {
						slidesPerView: 1.176,
					},
					767.98: {
						slidesPerView: 4.238,
					},
				},
			};

			configurePagination(sliderAdvantages, config, slides);
			return new Swiper(sliderAdvantages, config);
		});
	}
	if (document.querySelectorAll('[data-slider-customers]').length > 0) {
		document.querySelectorAll('[data-slider-customers]').forEach(sliderBlockCustomers => {
			const slides = sliderBlockCustomers.querySelectorAll('.swiper-slide');
			const config = {
				modules: [Navigation, EffectFade],
				observer: true,
				observeParents: true,
				slidesPerView: 1,
				spaceBetween: 0,
				speed: 400,
				grabCursor: false,
				autoHeight: true,
				effect: 'fade',
				allowTouchMove: true,
				fadeEffect: {
					crossFade: true,
				},
				navigation: {
					prevEl: sliderBlockCustomers.querySelector('[data-prev-slide]'),
					nextEl: sliderBlockCustomers.querySelector('[data-next-slide]'),
				},
			};

			configurePagination(sliderBlockCustomers, config, slides);
			return new Swiper(sliderBlockCustomers, config);
		});
	}
	if (document.querySelectorAll('[data-slider-reviews]').length > 0) {
		document.querySelectorAll('[data-slider-reviews]').forEach(sliderBlockCustomers => {
			const slides = sliderBlockCustomers.querySelectorAll('.swiper-slide');
			const config = {
				modules: [Navigation, EffectFade],
				observer: true,
				observeParents: true,
				slidesPerView: 1,
				spaceBetween: 0,
				speed: 400,
				grabCursor: true,
				autoHeight: true,
				effect: 'fade',
				fadeEffect: {
					crossFade: true,
				},
				navigation: {
					prevEl: sliderBlockCustomers.querySelector('[data-prev-slide]'),
					nextEl: sliderBlockCustomers.querySelector('[data-next-slide]'),
				},
			};

			configurePagination(sliderBlockCustomers, config, slides);
			return new Swiper(sliderBlockCustomers, config);
		});
	}
	if (document.querySelectorAll('[data-slider-products]').length > 0) {
		document.querySelectorAll('[data-slider-products]').forEach(sliderProducts => {
			const slides = sliderProducts.querySelectorAll('.swiper-slide');
			const config = {
				modules: [EffectFade],
				observer: true,
				observeParents: true,
				slidesPerView: 1,
				spaceBetween: 0,
				speed: 400,
				effect: 'fade',
				allowTouchMove: false,
				fadeEffect: {
					crossFade: true,
				},
			};

			configurePagination(sliderProducts, config, slides);
			return new Swiper(sliderProducts, config);
		});
	}
}

function createMobileProductsSlider() {
	const sliders = [];
	const sliderElements = document.querySelectorAll('[data-mobile-slider-products]');
	if (sliderElements.length > 0) {
		sliderElements.forEach(sliderEl => {
			const swiper = new Swiper(sliderEl, {
				observer: true,
				observeParents: true,
				slidesPerView: 1.1,
				spaceBetween: 20,
				speed: 600,
				breakpoints: {
					320: {
						slidesPerView: 1.1,
						spaceBetween: 20,
					},
					640: {
						slidesPerView: 2.1,
						spaceBetween: 20,
					},
				},
			});
			sliders.push(swiper);
		});
	}
	return sliders;
}
function changeSliders(sliderFunc, breakpoint) {
	let currentMode;
	let sliders = [];
	function handleResize() {
		const globalWindowWidth = document.documentElement.clientWidth;
		if (globalWindowWidth <= breakpoint && currentMode !== 'mobile') {
			sliderInit();
			currentMode = 'mobile';
		} else if (globalWindowWidth > breakpoint && currentMode !== 'desktop') {
			removeSlider();
			currentMode = 'desktop';
		}
	}

	function sliderInit() {
		sliders = sliderFunc();
	}

	function removeSlider() {
		sliders.forEach(slider => {
			if (slider && !slider.isDestroyed) {
				slider.destroy(true, true);
			}
		});
		sliders = [];
	}

	handleResize();
	window.addEventListener('resize', handleResize);
}

window.addEventListener("load", function () {
	changeSliders(createMobileProductsSlider, 767.98);
});

export default initSliders;