import { updateModal, hideModal } from '../components/modal.js';

let sessionTimeout;
const SESSION_DURATION = 1 * 1000;
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

function setSessionTimeout() {
	sessionTimeout = setTimeout(() => {
		sessionWarning();
	}, SESSION_DURATION);
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
		closeLogic: () => {
			clearTimeout(modalTimeout);
			destroySession();
			hideModal();
		}
	});
};

function extendSessionNotice() {
	updateModal({ message: "Session is extended!", title: "Session Extend Success" });
};

export function initSessionTimeout() {
	['mousemove', 'keydown', 'click'].forEach(e => {
		window.addEventListener(e, touchSession);
	});
	setSessionTimeout();
};

