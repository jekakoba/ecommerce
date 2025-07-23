
import { _slideUp, _slideToggle, _slideDown } from "./helpers.js";

/*
// Setting up
For Select (SELECT):
class="Name of class" - A modifier to a particular selection
multiple - multititey
data-class-modif= "Modifier name"
data-tags - Tag mode, only for (for Multiple only)
data-scroll - Enable scroll for a drop -down list you can additionally connect a custom scroll simplebar в app.js. The specified number for the attribute will limit the height
data-checkbox - Stylization of items by Checkbox (only for Multiple)
data-show-selected - Disables the concealment of the selected item
data-search - allows you to search the list that falls out
data-open - The selection is open immediately
data-submit - sends a form when you change the selection

data-one-select - Seleks inside the attribute shell will only be shown one by one
data-pseudo-label - adds a pseudo -element to the header of the selection with the specified text

For Pleischolder (Pleischolder is an option with Value = "):
data-label for the Pleisholder, adds Label to the selection
data-show for Pleisholder, shows it in the list (only for a single choice)

For an item (option):
data-class="Name of class" - adds the class
data-asset="Path to a picture or text " - adds the structure of 2 columns and data
data-href="Link address " - adds link to the list item
data-href-blank - will open the link in the new window
*/

class SelectConstructor {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			logging: true,
			speed: 150
		}
		this.config = Object.assign(defaultConfig, props);
		// CSS classes of module
		this.selectClasses = {
			classSelect: "select", // The main block
			classSelectBody: "select__body", //The body of the selection
			classSelectTitle: "select__title", // Title
			classSelectValue: "select__value", // The value in the title
			classSelectLabel: "select__label", // Label
			classSelectInput: "select__input", // Introduction field
			classSelectText: "select__text", // Text data shell
			classSelectLink: "select__link", // Link in an item
			classSelectOptions: "select__options", // List
			classSelectOptionsScroll: "select__scroll", // The shell with a temple
			classSelectOption: "select__option", // Paragraph
			classSelectContent: "select__content", // The content shell in the header
			classSelectRow: "select__row", // Row
			classSelectData: "select__asset", // Additional data
			classSelectDisabled: "_select-disabled", // Prohibited
			classSelectTag: "_select-tag", // Tag class
			classSelectOpen: "_select-open", // The list is open
			classSelectActive: "_select-active", // The list is selected
			classSelectFocus: "_select-focus", // List in focus
			classSelectMultiple: "_select-multiple", // Multititey
			classSelectCheckBox: "_select-checkbox", // Checkbox style
			classSelectOptionSelected: "_select-selected", // Selected item
			classSelectPseudoLabel: "_select-pseudo-label", // Pseudolebl
		}
		this._this = this;
		// Running initialization
		if (this.config.init) {
			// Obtaining all the Select on the page
			const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll('select');
			if (selectItems.length) {
				this.selectsInit(selectItems);
			}
		}
	}
	// CSS designer class
	getSelectClass(className) {
		return `.${className}`;
	}
	// Getter elements of pseudoselectric
	getSelectElement(selectItem, className) {
		return {
			originalSelect: selectItem.querySelector('select'),
			selectElement: selectItem.querySelector(this.getSelectClass(className)),
		}
	}
	// The function of initialization of all selections
	selectsInit(selectItems) {
		selectItems.forEach((originalSelect, index) => {
			this.selectInit(originalSelect, index + 1);
		});
		// Event handlers ... 
		// ... at click
		document.addEventListener('click', function (e) {
			this.selectsActions(e);
		}.bind(this));
		// ... when you press the key
		document.addEventListener('keydown', function (e) {
			this.selectsActions(e);
		}.bind(this));
		// ... at focus
		document.addEventListener('focusin', function (e) {
			this.selectsActions(e);
		}.bind(this));
		// ... at the loss of focus
		document.addEventListener('focusout', function (e) {
			this.selectsActions(e);
		}.bind(this));
	}
	// Function of Initialization of a particular selection
	selectInit(originalSelect, index) {
		const _this = this;
		// Create a shell
		let selectItem = document.createElement("div");
		selectItem.classList.add(this.selectClasses.classSelect);
		// remove the shell in front of the original selection
		originalSelect.parentNode.insertBefore(selectItem, originalSelect);
		// Put the original selection in the shell
		selectItem.appendChild(originalSelect);
		// hide the original selection
		originalSelect.hidden = true;
		// assign a unique ID
		index ? originalSelect.dataset.id = index : null;

		// Working with Pleischolder
		if (this.getSelectPlaceholder(originalSelect)) {
			// Remember the Pleischolder
			originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
			// If Label mode is enabled
			if (this.getSelectPlaceholder(originalSelect).label.show) {
				const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
				selectItemTitle.insertAdjacentHTML('afterbegin', `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
			}
		}
		// Designer of basic elements
		selectItem.insertAdjacentHTML('beforeend', `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
		// Start the pseudoselectric designer
		this.selectBuild(originalSelect);

		// We memorize speed
		originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
		this.config.speed = +originalSelect.dataset.speed;

		// event when changing the original Select
		originalSelect.addEventListener('change', function (e) {
			_this.selectChange(e);
		});
	}
	// Designer of pseudosselectric
	selectBuild(originalSelect) {
		const selectItem = originalSelect.parentElement;
		// add ID to the selection
		selectItem.dataset.id = originalSelect.dataset.id;
		// We get the class of original selection, create a modifier and add it
		originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
		// If multiple choice, add the class
		originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
		// Site of items under checkbox (only for Multiple)
		originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
		// Setter value of the heading of the selection
		this.setSelectTitleValue(selectItem, originalSelect);
		// List items (options)
		this.setOptions(selectItem, originalSelect);
		// If the Data-Search search option is enabled, we run the handler
		originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
		// If the Data-Open Settings, open the selection
		originalSelect.hasAttribute('data-open') ? this.selectAction(selectItem) : null;
		// Disabled handler
		this.selectDisabled(selectItem, originalSelect);
	}
	// Function of reactions to events
	selectsActions(e) {
		const targetElement = e.target;
		const targetType = e.type;
		if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
			const selectItem = targetElement.closest('.select') ? targetElement.closest('.select') : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
			const originalSelect = this.getSelectElement(selectItem).originalSelect;
			if (targetType === 'click') {
				if (!originalSelect.disabled) {
					if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
						// processing a click on a tag
						const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
						const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
						this.optionAction(selectItem, originalSelect, optionItem);
					} else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) {
						// Treatment of click on the heading of the selection
						this.selectAction(selectItem);
					} else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
						// Treatment of click on a selection element
						const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
						this.optionAction(selectItem, originalSelect, optionItem);
					}
				}
			} else if (targetType === 'focusin' || targetType === 'focusout') {
				if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) {
					targetType === 'focusin' ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
				}
			} else if (targetType === 'keydown' && e.code === 'Escape') {
				this.selectsСlose();
			}
		} else {
			this.selectsСlose();
		}
	}
	// Function of all selections
	selectsСlose(selectOneGroup) {
		const selectsGroup = selectOneGroup ? selectOneGroup : document;
		const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
		if (selectActiveItems.length) {
			selectActiveItems.forEach(selectActiveItem => {
				this.selectСlose(selectActiveItem);
			});
		}
	}
	// Function of a particular selection
	selectСlose(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		if (!selectOptions.classList.contains('_slide')) {
			selectItem.classList.remove(this.selectClasses.classSelectOpen);
			_slideUp(selectOptions, originalSelect.dataset.speed);
			setTimeout(() => {
				selectItem.style.zIndex = '';
			}, originalSelect.dataset.speed);
		}
	}
	// function of opening/closing a particular selection
	selectAction(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;

		// Identify where to dig a listed list
		this.setOptionsPosition(selectItem);

		// If the selectives are placed in an item with DATA-ON-SELECT attribute date 
		// close all open selections
		if (originalSelect.closest('[data-one-select]')) {
			const selectOneGroup = originalSelect.closest('[data-one-select]');
			this.selectsСlose(selectOneGroup);
		}

		setTimeout(() => {
			if (!selectOptions.classList.contains('_slide')) {
				selectItem.classList.toggle(this.selectClasses.classSelectOpen);
				_slideToggle(selectOptions, originalSelect.dataset.speed);

				if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
					selectItem.style.zIndex = selectOpenzIndex;
				} else {
					setTimeout(() => {
						selectItem.style.zIndex = '';
					}, originalSelect.dataset.speed);
				}
			}
		}, 0);
	}
	// Setter value of the heading of the selection
	setSelectTitleValue(selectItem, originalSelect) {
		const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
		const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
		if (selectItemTitle) selectItemTitle.remove();
		selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
		originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
	}
	// Designer of the value of the title
	getSelectTitleValue(selectItem, originalSelect) {
		// We get selected textuals
		let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
		// Treatment
		// If Tag mode is enabled (Data-Tags setting
		if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
			selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map(option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`).join('');
			// If tags are removed in the outer blouseк
			if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
				document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
				if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
			}
		}
		// Value or Pleischolder
		selectTitleValue = selectTitleValue.length ? selectTitleValue : (originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : '');
		// If Pseudo mode is enabled
		let pseudoAttribute = '';
		let pseudoAttributeClass = '';
		if (originalSelect.hasAttribute('data-pseudo-label')) {
			pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
			pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
		}
		// If there is a value, we add class
		this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
		// Turn the Introduction Field for Search or Text
		if (originalSelect.hasAttribute('data-search')) {
			// Identify the Introduction Field for Search
			return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
		} else {
			// If an item is selected with your class
			const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : '';
			// Identify the textual meaning
			return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
		}
	}
	// Data Designer for Header Value
	getSelectElementContent(selectOption) {
		// If the element is given a picture of a picture or text, we rebuild the structure
		const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : '';
		const selectOptionDataHTML = selectOptionData.indexOf('img') >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
		let selectOptionContentHTML = ``;
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : '';
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : '';
		selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : '';
		selectOptionContentHTML += selectOption.textContent;
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		return selectOptionContentHTML;
	}
	// Obtaining Pleischolder data
	getSelectPlaceholder(originalSelect) {
		const selectPlaceholder = Array.from(originalSelect.options).find(option => !option.value);
		if (selectPlaceholder) {
			return {
				value: selectPlaceholder.textContent,
				show: selectPlaceholder.hasAttribute("data-show"),
				label: {
					show: selectPlaceholder.hasAttribute("data-label"),
					text: selectPlaceholder.dataset.label
				}
			}
		}
	}
	// obtaining data from selected items
	getSelectedOptionsData(originalSelect, type) {
		// We get all selected objects with SELECT
		let selectedOptions = [];
		if (originalSelect.multiple) {
			// If the multi -compilation 
			// pick up the Pleischolder, get the rest of the selected items
			selectedOptions = Array.from(originalSelect.options).filter(option => option.value).filter(option => option.selected);
		} else {
			// If a single choice
			selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
		}
		return {
			elements: selectedOptions.map(option => option),
			values: selectedOptions.filter(option => option.value).map(option => option.value),
			html: selectedOptions.map(option => this.getSelectElementContent(option))
		}
	}
	// Designer of the list of list
	getOptions(originalSelect) {
		// Setting the scroll of items
		const selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
		const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;
		// We get the list items
		let selectOptions = Array.from(originalSelect.options);
		if (selectOptions.length > 0) {
			let selectOptionsHTML = ``;
			// If the Data-Show settings, we show the Pleischolder in the list
			if ((this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show) || originalSelect.multiple) {
				selectOptions = selectOptions.filter(option => option.value);
			}
			// build and deduce the main design
			selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ''} class="${this.selectClasses.classSelectOptionsScroll}">`;
			selectOptions.forEach(selectOption => {
				// We get the design of a particular list of list
				selectOptionsHTML += this.getOption(selectOption, originalSelect);
			});
			selectOptionsHTML += `</div>`;
			return selectOptionsHTML;
		}
	}
	// Designer of a particular list of list
	getOption(selectOption, originalSelect) {
		// If the element is selected and enabled with multiple mode, we add the class
		const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : '';
		// If the item is selected and no Data-Show-Selected setting, hide the item
		const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute('data-show-selected') && !originalSelect.multiple ? `hidden` : ``;
		// If for the item the specified class is added
		const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';
		// If the reference mode is specified
		const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
		const selectOptionLinkTarget = selectOption.hasAttribute('data-href-blank') ? `target="_blank"` : '';
		// build and return the structure of the item
		let selectOptionHTML = ``;
		selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
		selectOptionHTML += this.getSelectElementContent(selectOption);
		selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
		return selectOptionHTML;
	}
	// List items (options)
	setOptions(selectItem, originalSelect) {
		// We get the body object of the pseudoselectric
		const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		// Start the list of list items (options) and add to the body of the pseudoselectric
		selectItemOptions.innerHTML = this.getOptions(originalSelect);
	}
	// Identify where to dig a listed list
	setOptionsPosition(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
		const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
		const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;

		if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
			selectOptions.hidden = false;
			const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue('max-height'));
			const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
			const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
			selectOptions.hidden = true;

			const selectItemHeight = selectItem.offsetHeight;
			const selectItemPos = selectItem.getBoundingClientRect().top;
			const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
			const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

			if (selectItemResult < 0) {
				const newMaxHeightValue = selectOptionsHeight + selectItemResult;
				if (newMaxHeightValue < 100) {
					selectItem.classList.add('select--show-top');
					selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
				} else {
					selectItem.classList.remove('select--show-top');
					selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
				}
			}
		} else {
			setTimeout(() => {
				selectItem.classList.remove('select--show-top');
				selectItemScroll.style.maxHeight = customMaxHeightValue;
			}, +originalSelect.dataset.speed);
		}
	}
	// click handler on the list
	optionAction(selectItem, originalSelect, optionItem) {
		const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
		if (!selectOptions.classList.contains('_slide')) {
			if (originalSelect.multiple) {// If the multi -compilation
				// Identify the class element
				optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
				// clean the selected items
				const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
				originalSelectSelectedItems.forEach(originalSelectSelectedItem => {
					originalSelectSelectedItem.removeAttribute('selected');
				});
				// Choose elements
				const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
				selectSelectedItems.forEach(selectSelectedItems => {
					originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute('selected', 'selected');
				});
			} else { // If a single choice
				// Unless the Data-Show-Selected setting is specified, we hide the selected item
				if (!originalSelect.hasAttribute('data-show-selected')) {
					setTimeout(() => {
						// first to show everything
						if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) {
							selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
						}
						// Hide the selected
						optionItem.hidden = true;
					}, this.config.speed);
				}
				originalSelect.value = optionItem.hasAttribute('data-value') ? optionItem.dataset.value : optionItem.textContent;
				this.selectAction(selectItem);
			}
			// Update the selection of the selection
			this.setSelectTitleValue(selectItem, originalSelect);
			// cause a response to a selection of selection
			this.setSelectChange(originalSelect);
		}
	}
	// reaction to the change of original Select
	selectChange(e) {
		const originalSelect = e.target;
		this.selectBuild(originalSelect);
		this.setSelectChange(originalSelect);
	}
	// handler change in the selection
	setSelectChange(originalSelect) {
		// Instant Validation of Select
		if (originalSelect.hasAttribute('data-validate')) {
			formValidate.validateInput(originalSelect);
		}
		// When changing the selection we send a form
		if (originalSelect.hasAttribute('data-submit') && originalSelect.value) {
			let tempButton = document.createElement("button");
			tempButton.type = "submit";
			originalSelect.closest('form').append(tempButton);
			tempButton.click();
			tempButton.remove();
		}
		const selectItem = originalSelect.parentElement;
		// Call of Kolbek Function
		this.selectCallback(selectItem, originalSelect);
	}
	// Disabled handler
	selectDisabled(selectItem, originalSelect) {
		if (originalSelect.disabled) {
			selectItem.classList.add(this.selectClasses.classSelectDisabled);
			this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
		} else {
			selectItem.classList.remove(this.selectClasses.classSelectDisabled);
			this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
		}
	}
	// Search handler by list items
	searchActions(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
		const _this = this;
		selectInput.addEventListener("input", function () {
			selectOptionsItems.forEach(selectOptionsItem => {
				if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) {
					selectOptionsItem.hidden = false;
				} else {
					selectOptionsItem.hidden = true;
				}
			});
			// If the list is closed
			selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
		});
	}
	// Kolbek function
	selectCallback(selectItem, originalSelect) {
		document.dispatchEvent(new CustomEvent("selectCallback", {
			detail: {
				select: originalSelect
			}
		}));
	}
}

export default SelectConstructor;

