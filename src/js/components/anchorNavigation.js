export default function anchorNavigation() {
	const body = document.querySelector('body');
	document.addEventListener('click', documentActions);
	function documentActions(e) {
		const target = e.target;
		if (!target.classList.contains('.anchor') && scrol == true) {
			body.addEventListener('click', stopAnimation);
		}
	}
	let stop = false;
	let scrol = false;
	function stopAnimation() {
		stop = true;
	}
	const scrolling = () => {
		const links = document.querySelectorAll(".anchor");
		const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
		for (let i = 0; i < links.length; i++) {
			let speed = links[i].dataset.anchorSpeed ? Number(links[i].dataset.anchorSpeed) : 0.3;
			links[i].addEventListener("click", function (event) {
				event.preventDefault();
				let widthTop = Math.round(document.documentElement.scrollTop || document.body.scrollTop),
					hash = this.hash;
				let toBlock = document.querySelector(hash).getBoundingClientRect().top - headerHeight;
				let start = null;
				requestAnimationFrame(step);
				scrol = true;
				function step(time) {
					if (start === null) {
						start = time;
					}
					let progress = time - start,
						r =
							toBlock < 0
								? Math.max(widthTop - progress / speed, widthTop + toBlock)
								: Math.min(widthTop + progress / speed, widthTop + toBlock);

					let element = document.documentElement || document.body;
					element.scrollTo(0, r);

					if (r != widthTop + toBlock && !stop) {
						requestAnimationFrame(step);
					} else {
						body.removeEventListener('click', stopAnimation);
						stop = false;
						scrol = false;
					}
				}
			});
		}
	};
	const highlightNavOnScroll = () => {
		function handleScroll() {
			let scrollDistance = window.scrollY;
			const navLinks = document.querySelectorAll('.anchor');
			if (!navLinks) return;
			const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
			navLinks.forEach((link, i) => {
				const section = document.querySelector(link.hash);
				if (!section) return;
				const sectionTop = section.offsetTop - headerHeight - 50;
				const sectionBottom = sectionTop + section.offsetHeight;
				if (scrollDistance >= sectionTop && scrollDistance < sectionBottom) {
					navLinks.forEach(l => l.classList.remove('_current-section'));
					link.classList.add('_current-section');
				}
			});
		}
		window.addEventListener('scroll', handleScroll);
		handleScroll();
	};
	scrolling();
	highlightNavOnScroll();
}

































// const pageNavScroll = () => {
// 	function handleScroll() {
// 		let scrollDistance = window.scrollY - 100
// 		const sections = document.querySelectorAll('[data-nav-block]')
// 		const navLinks = document.querySelectorAll('[data-nav-links] a')
// 		if (!sections && !navLinks) return
// 		sections.forEach((section, i) => {
// 			if ((section.offsetTop - (document.querySelector('header').clientHeight) - 100) <= (scrollDistance)) {
// 				navLinks.forEach(link => {
// 					if (link.classList.contains('_current-section')) {
// 						link.classList.remove('_current-section')
// 					}
// 				})
// 				navLinks[i].classList.add('_current-section')
// 			}
// 		})
// 	}
// 	window.addEventListener('scroll', handleScroll)
// 	handleScroll()
// }
// document.addEventListener('DOMContentLoaded', pageNavScroll)