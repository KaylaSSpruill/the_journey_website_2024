import { updateModal, hideModal } from '../components/modal.js';

const SESSION_DURATION = 10 * 60 * 1000;
const USER_CONFIRM_DURATION = 3 * 60 * 1000;

export function initSessionTimeout() {
	let sessionTimeout; 
	let warning = false;
	
	function sessionWarning() {
		warning = true;
		let modalTimeout = setTimeout(() => {
				destroySession();
				clearTimeout(modalTimeout);
				updateModal({ 
					message: "Your session expired, please log in again! ", 
					title: "Session Expired",
					closeLogic: () => {
						hideModal();
						location.reload();
					}
				});
		}, USER_CONFIRM_DURATION);
		
		const extendSession = () => {
			warning = false;
			clearTimeout(modalTimeout);
			extendSessionNotice();
		};
		
		updateModal({ 
			message: "You've been inactive, do you want to extend your session?", 
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
	}
	
	function touchSession() {
		if (!warning) {
			clearTimeout(sessionTimeout);	
			setSessionTimeout();
		}
	}

	function setSessionTimeout() {
		sessionTimeout = setTimeout(() => {
			sessionWarning();
		}, SESSION_DURATION);
	}
	
	function destroySession() {
		fetch('logout', {
			method: 'POST', 
		});
	}

	function extendSessionNotice() {
		updateModal({ message: "Session is extended!", title: "Session Extend Success" });
	}
	
	['mousemove', 'keydown', 'click'].forEach(e => {
		window.addEventListener(e, touchSession);
	});
	
	setSessionTimeout();
};

