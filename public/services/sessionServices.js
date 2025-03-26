let sessionTimeout;
const SESSION_DURATION = 10 * 60 * 1000;
const USER_CONFIRM_DURATION = 3 * 60 * 1000;

function destroySession() {
	fetch('logout', {
		method: 'POST', 
	});
};

function touchSession() {
	clearTimeout(sessionTimeout);	
	setSessionTimeout();
};

export function setSessionTimeout() {
	['mousemove', 'keydown', 'click'].forEach(e => {
		window.addEventListener(e, touchSession);
	});
	sessionTimeout = setTimeout(() => {
		
	}, SESSION_DURATION); //Sets max timeout to be 10 minutes
};

function sessionWarning() {
	let modalTimeout = setTimeout(() => {
			destroySession();
			hideModal();
	}, USER_CONFIRM_DURATION);
	
	const extendSession = () => {
		touchSession();
		clearTimeout(modalTimeout);
		extendSessionNotice();
	};
	
	updateModal({ 
		message: "You've been inactive for long, do you want to extend your session?", 
		title: "Session Time Out", callback: sessionWarning, 
		button1: { 
			message: "Extend", 
			eventListener: {
				event: 'click',
				listener: extendSession
			}
		},
		closeLogic: {
			clearTimeout(modalTimeout);
			destroySession();
			hideModal();
		}
	});
	
};

function extendSessionNotice() {
	updateModal({ message: "Session is extended!", title: "Session Extend Success" });
};



