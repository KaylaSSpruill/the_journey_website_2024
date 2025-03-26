import { createUserProfile } from '/components/userProfile.js';
import { setSessionTimeout } from '/services/sessionServices.js';

function LoadElement() {
	document.addEventListener('DOMContentLoaded', function() {
		createUserProfile();
		setSessionTimeout();
	});
};

LoadElement();