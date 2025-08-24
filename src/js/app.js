/**
 * Main JavaScript entry point
 * 
 * This file imports and initializes all components
 */

// Import CSS for Vite processing
import '../css/app.css';

// Import components
import watchElementHeights from './components/getElementHeight.js';
import showHideHeader from './components/headerScroll.js';
import *as spoiler from './components/spoilers/FESpoilers.js';
import { initParallax } from './components/parallax.js';
import { initMousePRLX } from './components/parallaxMouse.js';
import swiper from './components/swiper.js';
import tabs from './components/tabs.js';
import SelectConstructor from './components/select.js';
import anchorNavigation from './components/anchorNavigation.js';
import showMore from './components/showMore.js';
import addToEnquiryList from './components/addToEnquiryList.js';
import counterComments from './components/counterComments.js';
import mircoModalInit from './components/modal/modalConfig.js'
import stepsRingSize from './components/stepsRingSize.js';


function showSubMenuItem() {
	const submenu = document.querySelectorAll('[data-sub-menu]');
	if (submenu.length === 0) return;
	const submenuItems = document.querySelectorAll('[data-sub-menu] > li');
	submenuItems.forEach(item => {
		item.addEventListener('click', function (e) {
			const target = e.target;
			if (target.closest('a')) {
				e.preventDefault();
				submenuItems.forEach(otherItem => otherItem.classList.remove('active-sub-menu-item'));
				item.classList.add('active-sub-menu-item');
			}
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM fully loaded and parsed');
	watchElementHeights();
	showHideHeader();
	initParallax();
	initMousePRLX();
	swiper();
	spoiler.FESpoilers();
	tabs();
	showMore();
	anchorNavigation()
	new SelectConstructor({});
	mircoModalInit();
	addToEnquiryList()
	counterComments();
	stepsRingSize();
	showSubMenuItem()
	// Initialize components
	// const components = {};

	// Initialize mobile menu if it exists
	// if (document.querySelector('.mobile-menu__toggle')) {
	// 	components.mobileMenu = new MobileMenu();
	// }

	// Initialize accordion if it exists
	// if (document.querySelector('.accordion')) {
	// 	components.accordion = new Accordion();
	// }

	// Make components available globally for debugging if needed
	if (import.meta.env.DEV) {
		// window.components = components;
	}
});
