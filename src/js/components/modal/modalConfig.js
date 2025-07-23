import MircoModal from './MicroModal.js';
import { bodyLock, bodyUnlock } from "../helpers.js";

export default function mircoModalInit() {
	MircoModal.init({
		onShow: (modal) => callbackOpen(modal),
		onClose: (modal) => callbackClose(modal),
		onBeforeShow: (modal) => callbackBeforeOpen(modal),
		onBeforeClose: (modal) => callbackBeforeClose(modal),
		openTrigger: 'data-modal-open',
		closeTrigger: 'data-modal-close',
		openClass: 'is-open',
		openDocumentClass: 'modal-open',
		disableFocus: true,
		awaitOpenAnimation: false,
		awaitCloseAnimation: false,
		debugMode: true,

	});
}

const callbackOpen = (modal) => {
	bodyLock(300);
	if (modal.id === 'global-search-modal') {
		document.documentElement.classList.add('modal-search-open');
		const searchInput = modal.querySelector('[data-search-input]');
		if (!searchInput) rerturn
		setTimeout(() => searchInput.focus(), 100);

	}
};
const callbackClose = (modal) => {
	document.documentElement.classList.remove('modal-search-open');
	bodyUnlock(300);
};
const callbackBeforeOpen = (modal) => {
}
const callbackBeforeClose = (modal) => {
}