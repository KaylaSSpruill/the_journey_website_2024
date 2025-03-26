let sessionTimeout;

const SESSION_DURATION = 10 * 60 * 1000;

async function destroySession() {
	await fetch('logout', {
		method: 'POST', 
	});
};

export function setSessionTimeout() {
	['mousemove', 'keydown', 'click'].forEach(e => {
		window.addEventListener(e, touchSession);
	});
	sessionTimeout = setTimeout(() => {
		/* @todo add the modal notification that if user does not confirm it will log out */
	destroySession();	
	}, SESSION_DURATION); //Sets max timeout to be 10 minutes
};


function touchSession() {
	clearTimeout(sessionTimeout);	
	setSessionTimeout();
};

