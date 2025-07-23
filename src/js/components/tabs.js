
function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash = [];
	if (tabs.length === 0) {
		console.warn('No elements with [data-tabs] found');
		return;
	}
	tabs.forEach((tabsBlock, index) => {
		tabsBlock.classList.add('_tab-init');
		tabsBlock.setAttribute('data-tabs-index', index); // Індекс контейнера
		tabsBlock.addEventListener("click", setTabsAction);
		initTabs(tabsBlock);
	});

	function initTabs(tabsBlock) {
		let tabsTitles = Array.from(tabsBlock.querySelectorAll('[data-tabs-targets] > [data-tabs-target]'));
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body] > [data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsTitles.length === 0 || tabsContent.length === 0) {
			console.warn('Tabs initialization failed: titles or content not found', tabsBlock);
			return;
		}

		if (tabsTitles.length !== tabsContent.length) {
			console.warn('Mismatch between titles and content items', tabsTitles.length, tabsContent.length);
			return;
		}

		tabsContent.forEach((tabsContentItem, index) => {
			if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
				tabsTitles[index].classList.add('_tab-active');
				tabsContentItem.classList.remove('_hidden');
				tabsBlock.setAttribute('data-tabs-index', index);
			} else if (!tabsTitles[index].classList.contains('_tab-active')) {
				tabsContentItem.classList.add('_hidden');
			}
		});
	}

	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-target]');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

		tabsContent.forEach((tabsContentItem, index) => {
			if (tabsTitles[index].classList.contains('_tab-active')) {
				tabsContentItem.classList.remove('_hidden');
				tabsBlock.setAttribute('data-tabs-index', index);
				if (tabsBlock.hasAttribute('data-tabs-hash')) {
					setHash(`tab-${tabsBlockIndex}-${index}`);
				}
			} else {
				tabsContentItem.classList.add('_hidden');
			}
		});
	}
	function setTabsAction(e) {
		const el = e.target;
		const tabTitle = el.closest('[data-tabs-target]');
		if (tabTitle) {
			const tabsBlock = tabTitle.closest('[data-tabs]');
			if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
				const tabActiveTitle = tabsBlock.querySelector('[data-tabs-target]._tab-active');
				if (tabActiveTitle) tabActiveTitle.classList.remove('_tab-active');
				tabTitle.classList.add('_tab-active');
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}


export default tabs;