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
	const submenu = document.querySelector('[data-sub-menu]');
	if (!submenu) return;
	const submenuItems = submenu.querySelectorAll('[data-sub-menu-item]');
	if (submenuItems.length > 0) {
		submenuItems[0].classList.add('active-sub-menu-item');
	}
	submenuItems.forEach(item => {
		item.addEventListener('mouseenter', function () {
			submenuItems.forEach(otherItem => {
				otherItem.classList.remove('active-sub-menu-item');
			});
			item.classList.add('active-sub-menu-item');
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const dropdownItems = document.querySelectorAll('[data-open-dropdown]');
	const htmlElement = document.documentElement;

	dropdownItems.forEach(item => {
		const dropdown = item.querySelector('[data-dropdown]');
		const link = item.querySelector('a');

		// Prevent default behavior of the link
		link.addEventListener('click', (e) => {
			e.preventDefault();
		});

		// Handle hover
		item.addEventListener('mouseenter', () => {
			htmlElement.classList.add('open-dropdown-menu');
		});

		// Handle click to toggle
		item.addEventListener('click', () => {
			htmlElement.classList.toggle('open-dropdown-menu');
		});

		// Remove class when mouse leaves dropdown
		dropdown.addEventListener('mouseleave', () => {
			htmlElement.classList.remove('open-dropdown-menu');
		});
	});
});
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
	showDropdownMenu()
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
