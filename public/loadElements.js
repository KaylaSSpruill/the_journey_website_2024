import { createUserProfile } from '/components/userProfile.js';
import { initSessionTimeout } from '/services/sessionServices.js';

function LoadElement() {
	document.addEventListener('DOMContentLoaded', function() {
		createUserProfile();
		initSessionTimeout();
	});
};

LoadElement();