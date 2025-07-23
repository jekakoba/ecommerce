export function menuInit() {
	const openButton = document.querySelector('[data-menu-open]');
	if (openButton) {
		document.addEventListener('click', function (e) {
			if (bodyLockStatus && e.target.closest('[data-menu-open]')) {
				menuToggle();
			} else if (e.target.closest('[data-menu-close]')) {
				menuClose();
			}
		});
	}
}
export function menuOpen() {
	bodyLock();
	document.documentElement.classList.add('menu-open');
}
export function menuClose() {
	bodyUnlock();
	document.documentElement.classList.remove('menu-open');
}
export function menuToggle() {
	bodyLockToggle();
	document.documentElement.classList.toggle('menu-open');
}