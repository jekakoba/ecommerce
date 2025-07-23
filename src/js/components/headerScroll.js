function showHideHeader() {
	const header = document.getElementsByTagName('header');
	if (!header) return;
	let lastScrollTop = 0;

	window.addEventListener('scroll', function () {
		let scrollTop = window.scrollY || document.documentElement.scrollTop;
		// Checking or Scroll More XXX Pixels
		if (scrollTop > 1) {
			document.documentElement.classList.add('scrolled-page');
			if (scrollTop > lastScrollTop) {
				// Scroll down
				document.documentElement.classList.add('scrolled-down');
			} else {
				// Scroll up
				document.documentElement.classList.remove('scrolled-down');
			}
		} else {
			document.documentElement.classList.remove('scrolled-page');
		}

		lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
	});
}
export default showHideHeader

