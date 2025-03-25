import { createUserProfile } from '/components/userProfile.js';

function LoadElement() {
	document.addEventListener('DOMContentLoaded', function() {
		createUserProfile();
	});
};

LoadElement();