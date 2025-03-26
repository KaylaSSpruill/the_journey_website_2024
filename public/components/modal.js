function resetModal() {
	let modal = document.getElementById('modal');
	
	const modalTitle = modal.querySelector('h1');
	modalTitle.textContent = '';
	
	const closeBut = modal.querySelector('p.close-button');
	const newCloseBut = closeBut.cloneNode(true); // Clone to reset event listeners
	closeBut.replaceWith(newCloseBut); // Replace with a fresh instance
	
	const modalMessage = modal.querySelector('p.message');
	modalMessage.textContent = '';
	
	let buttons = modal.querySelectorAll('button');
	const newButtons = buttons.cloneNode(true);
	buttons.replaceWith(newButtons);
	buttons.style.display = "none";
};

function createModal() {
	let container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        container.style.position = "fixed";
        container.style.top = "10px";
        container.style.width= "440px";
        container.style.zIndex = "1000";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        document.body.appendChild(container);
    }
	let modal = document.createElement('div');
	modal.id = "modal";
	modal.style.display = "none";
    modal.style.position = "relative";
    modal.style.background = "white";
    modal.style.padding = "20px";
    modal.style.border = "1px solid black";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.width = "400px";
	
	const title = document.createElement('h1');
	
	const closeBut = document.createElement('p');
	closeBut.className = "close-button";
	closeBut.textContent = 'x';
	closeBut.style.position = "absolute";
    closeBut.style.top = "10px";
    closeBut.style.right = "10px";
    closeBut.style.cursor = "pointer";
	closeBut.addEventListener("click", hideModal);
	
	const modalMessage = document.createElement('p');
	modalMessage.className = "message";
	
	modal.appendChild(title);
	modal.appendChild(closeBut);
	modal.appendChild(modalMessage);
	
	const modalButton1 = document.createElement('button');
	modalButton1.className = "modal-button-left";
	modalButton1.style.display = "none";
	modal.appendChild(modalButton1);

	const modalButton2 = document.createElement('button');
	modalButton2.className = "modal-button-right";
	modalButton2.style.display = "none";
	modal.appendChild(modalButton2);

	
	container.appendChild(modal);
};

export function updateModal({ message = '', title = '', closeLogic = hideModal, button1, button2 }) {
	let modal = document.getElementById('modal');
	if (!modal) {
		createModal();
		modal = document.getElementById('modal');
	}
	
	resetModal();
	
	const modalTitle = modal.querySelector('h1');
	modalTitle.textContent = title;
		
	const closeBut = modal.querySelector('p.close-button');
	closeBut.addEventListener("click", closeLogic);
			
	const modalMessage = modal.querySelector('p.message');
	modalMessage.textContent = message;
	
	if (button1) {
		const modalButton1 = document.querySelector('.modal-button-left');
		if (button1.message) modalButton1.textContent = button1.message;
		if (button1.eventListener) 
			modalButton1.addEventListener(button1.eventListener.event, button1.eventListener.listner);
		modalButton2.style.display = "block";
	}
	if (button2) {
		const modalButton2 = document.querySelector('.modal-button-right');
		if (button2.message) modalButton2.textContent = button2.message;
		if (button2.eventListener) 
			modalButton2.addEventListener(button2.eventListener.event, button2.eventListener.listner);
		modalButton2.style.display = "block";
	}

	showModal();
};

export function showModal() {
	let modal = document.getElementById("modal");
	if (modal) modal.style.display = "block";
};

export function hideModal() {
	let modal = document.getElementById("modal");
	if (modal) modal.style.display = "none";
};