import { updateModal, hideModal } from '../components/modal.js';

const SESSION_DURATION = 15 * 1000; //Session lasts 1 minutes
const USER_CONFIRM_DURATION = 10 * 1000; //User confirm lasts 1 minutes

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
			title: "Session Time Out", 
			button1: { 
				message: "Extend", 
				eventListener: {
					event: 'click',
					listener: extendSession
				}
			},
			closeLogic: () => {
				clearTimeout(modalTimeout);
				hideModal();
				destroySession();
			}
		});
		
	}
	
	function touchSession() {
		if (!warning && now - lastActivity > 10000) {
			clearTimeout(sessionTimeout);	
			setSessionTimeout();
		}
	}

	function setSessionTimeout() {
		sessionTimeout = setTimeout(() => {
			sessionWarning();
		}, SESSION_DURATION);
	}
	
	async function destroySession() {
		await fetch('logout', {
			method: 'POST', 
		});
	}

	function extendSessionNotice() {
		updateModal({ message: "Session is extended!", title: "Session Extend Success" });
	}
	
	//Attach global event listeners to refresh session
	['mousemove', 'keydown', 'click'].forEach(e => {
		window.addEventListener(e, touchSession);
	});
	
	setSessionTimeout();
};

