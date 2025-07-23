export default function addToEnquiryList() {
	const buttonsAddToEnquiryList = document.querySelectorAll('[data-add-to-enquiry-list]');
	if (!buttonsAddToEnquiryList) return;
	document.addEventListener("click", function (e) {
		if (e.target.closest('[data-add-to-enquiry-list]')) {
			e.target.closest('[data-add-to-enquiry-list]').classList.toggle('added');
		}
	});
}