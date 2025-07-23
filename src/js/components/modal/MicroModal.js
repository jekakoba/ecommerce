const MicroModal = (() => {
	'use strict'

	const FOCUSABLE_ELEMENTS = [
		'a[href]',
		'area[href]',
		'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
		'select:not([disabled]):not([aria-hidden])',
		'textarea:not([disabled]):not([aria-hidden])',
		'button:not([disabled]):not([aria-hidden])',
		'iframe',
		'object',
		'embed',
		'[contenteditable]',
		'[tabindex]:not([tabindex^="-"])'
	]

	let zIndexCounter = 200

	// Keep a reference to the opened modal
	let activeModal = null

	class Modal {
		constructor({
			targetModal,
			triggers = [],
			onBeforeShow = () => { },
			onBeforeClose = () => { },
			onShow = () => { },
			onClose = () => { },
			openTrigger = 'data-micromodal-trigger',
			closeTrigger = 'data-micromodal-close',
			openClass = 'is-open',
			openDocumentClass = 'modal-open',
			disableScroll = false,
			disableFocus = false,
			awaitCloseAnimation = false,
			awaitOpenAnimation = false,
			singleActive = false,
			debugMode = false
		}) {
			// Save a reference of the modal
			this.modal = document.getElementById(targetModal)

			// Save a reference to the passed config
			this.config = { debugMode, singleActive, disableScroll, openTrigger, closeTrigger, openDocumentClass, openClass, onShow, onClose, onBeforeShow, onBeforeClose, awaitCloseAnimation, awaitOpenAnimation, disableFocus }

			// Register click events only if pre binding eventListeners
			if (triggers.length > 0) this.registerTriggers(...triggers)

			// pre bind functions for event listeners
			this.onClick = this.onClick.bind(this)
			this.onKeydown = this.onKeydown.bind(this)
		}

		/**
		 * Loops through all openTriggers and binds click event
		 * @param  {array} triggers [Array of node elements]
		 * @return {void}
		 */
		registerTriggers(...triggers) {
			triggers.filter(Boolean).forEach(trigger => {
				trigger.addEventListener('click', event => this.showModal(event))
			})
		}

		showModal(event = null) {
			if (this.config.singleActive && activeModal) {
				activeModal.closeModal()
			}

			if (typeof this.config.onBeforeShow === 'function') {
				this.config.onBeforeShow(this.modal, event)
			}
			this.activeElement = document.activeElement
			this.modal.setAttribute('aria-hidden', 'false')
			this.modal.classList.add(this.config.openClass)
			document.documentElement.classList.add(this.config.openDocumentClass)
			this.modal.style.zIndex = zIndexCounter++
			this.scrollBehaviour('disable')
			this.addEventListeners()

			if (this.config.awaitOpenAnimation) {
				const handler = () => {
					this.modal.removeEventListener('animationend', handler, false)
					this.setFocusToFirstNode()
				}
				this.modal.addEventListener('animationend', handler, false)
			} else {
				this.setFocusToFirstNode()
			}

			this.config.onShow(this.modal, this.activeElement, event)
			activeModal = this
		}

		closeModal(event = null) {
			if (typeof this.config.onBeforeClose === 'function') {
				this.config.onBeforeClose(this.modal, event)
			}
			const modal = this.modal
			this.modal.setAttribute('aria-hidden', 'true')
			this.removeEventListeners()
			this.modal.style.zIndex = 0
			this.scrollBehaviour('enable')
			if (this.activeElement && this.activeElement.focus) {
				this.activeElement.focus()
			}
			this.config.onClose(this.modal, this.activeElement, event)

			if (this.config.awaitCloseAnimation) {
				const openClass = this.config.openClass
				this.modal.addEventListener('animationend', function handler() {
					modal.classList.remove(openClass)
					modal.removeEventListener('animationend', handler, false)
				}, false)
			} else {
				modal.classList.remove(this.config.openClass)
				document.documentElement.classList.remove(this.config.openDocumentClass)
			}
			activeModal = null
		}

		closeModalById(targetModal) {
			this.modal = document.getElementById(targetModal)
			if (this.modal) this.closeModal()
		}

		scrollBehaviour(toggle) {
			if (!this.config.disableScroll) return
			const body = document.querySelector('body')
			switch (toggle) {
				case 'enable':
					Object.assign(body.style, { overflow: '' })
					break
				case 'disable':
					Object.assign(body.style, { overflow: 'hidden' })
					break
				default:
			}
		}

		addEventListeners() {
			// Listen for close triggers on the entire document
			document.addEventListener('touchstart', this.onClick)
			document.addEventListener('click', this.onClick)
			document.addEventListener('keydown', this.onKeydown)
		}

		removeEventListeners() {
			// Remove listeners from the document
			document.removeEventListener('touchstart', this.onClick)
			document.removeEventListener('click', this.onClick)
			document.removeEventListener('keydown', this.onKeydown)
		}

		/**
		 * Handles all click events for close triggers anywhere in the document.
		 * Closes modal if a target matches the closeTrigger attribute.
		 * @param {*} event Click Event
		 */
		onClick(event) {
			const target = event.target;
			const closeTriggerElements = document.querySelectorAll(`[${this.config.closeTrigger}]`);
			const isCloseTrigger = Array.from(closeTriggerElements).some(el => el === target || el.contains(target));

			if (isCloseTrigger) {
				event.preventDefault();
				event.stopPropagation();
				this.closeModal(event);
			}
		}

		onKeydown(event) {
			if (event.keyCode === 27) this.closeModal(event) // esc
			if (event.keyCode === 9) this.retainFocus(event) // tab
		}

		getFocusableNodes() {
			const nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS)
			return Array(...nodes)
		}

		setFocusToFirstNode() {
			if (this.config.disableFocus) return

			const focusableNodes = this.getFocusableNodes()

			if (focusableNodes.length === 0) return

			const nodesWhichAreNotCloseTargets = focusableNodes.filter(node => {
				return !node.hasAttribute(this.config.closeTrigger)
			})

			if (nodesWhichAreNotCloseTargets.length > 0) nodesWhichAreNotCloseTargets[0].focus()
			if (nodesWhichAreNotCloseTargets.length === 0) focusableNodes[0].focus()
		}

		retainFocus(event) {
			let focusableNodes = this.getFocusableNodes()

			if (focusableNodes.length === 0) return

			focusableNodes = focusableNodes.filter(node => {
				return (node.offsetParent !== null)
			})

			if (!this.modal.contains(document.activeElement)) {
				focusableNodes[0].focus()
			} else {
				const focusedItemIndex = focusableNodes.indexOf(document.activeElement)

				if (event.shiftKey && focusedItemIndex === 0) {
					focusableNodes[focusableNodes.length - 1].focus()
					event.preventDefault()
				}

				if (!event.shiftKey && focusableNodes.length > 0 && focusedItemIndex === focusableNodes.length - 1) {
					focusableNodes[0].focus()
					event.preventDefault()
				}
			}
		}
	}

	const generateTriggerMap = (triggers, triggerAttr) => {
		const triggerMap = []

		triggers.forEach(trigger => {
			const targetModal = trigger.attributes[triggerAttr].value
			if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = []
			triggerMap[targetModal].push(trigger)
		})

		return triggerMap
	}

	const validateModalPresence = id => {
		if (!document.getElementById(id)) {
			console.warn(`MicroModal: \u2757Seems like you have missed %c'${id}'`, 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.')
			console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', `<div class="modal" id="${id}"></div>`)
			return false
		}
	}

	const validateTriggerPresence = triggers => {
		if (triggers.length <= 0) {
			console.warn('MicroModal: \u2757Please specify at least one %c\'micromodal-trigger\'', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.')
			console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '<a href="#" data-micromodal-trigger="my-modal"></a>')
			return false
		}
	}

	const validateArgs = (triggers, triggerMap) => {
		validateTriggerPresence(triggers)
		if (!triggerMap) return true
		for (const id in triggerMap) validateModalPresence(id)
		return true
	}

	const init = config => {
		const options = Object.assign({}, { openTrigger: 'data-micromodal-trigger' }, config)
		const triggers = [...document.querySelectorAll(`[${options.openTrigger}]`)]
		const triggerMap = generateTriggerMap(triggers, options.openTrigger)

		if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return

		for (const key in triggerMap) {
			const value = triggerMap[key]
			options.targetModal = key
			options.triggers = [...value]
			activeModal = new Modal(options)
		}
	}

	const show = (targetModal, config) => {
		const options = config || {}
		options.targetModal = targetModal

		if (options.debugMode === true && validateModalPresence(targetModal) === false) return

		if (activeModal) activeModal.removeEventListeners()

		activeModal = new Modal(options)
		activeModal.showModal()
	}

	const close = targetModal => {
		targetModal ? activeModal.closeModalById(targetModal) : activeModal.closeModal()
	}

	return { init, show, close }
})()

export default MicroModal;