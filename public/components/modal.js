export async function updateModal({ message = '', title = '', closeLogic = hideModal, button1, button2 }) {
	let modal = document.getElementById('modal');
	if (!modal) {
		createModal();
		modal = document.getElementById('modal');
	}
	
	await resetModal();
	
	const modalTitle = modal.querySelector('h1');
	modalTitle.textContent = title;
		
	const closeBut = modal.querySelector('.modal-close-button');
	closeBut.addEventListener("click", closeLogic);
			
	const modalMessage = modal.querySelector('.modal-message');
	modalMessage.textContent = message;
	
	if (button1) {
		const modalButton1 = document.querySelector('.modal-button-left');
		if (button1.message) modalButton1.textContent = button1.message;
		if (button1.eventListener) 
			modalButton1.addEventListener(button1.eventListener.event, button1.eventListener.listener);
		modalButton1.style.display = "block";
	}
	
	if (button2) {
		const modalButton2 = document.querySelector('.modal-button-right');
		if (button2.message) modalButton2.textContent = button2.message;
		if (button2.eventListener) 
			modalButton2.addEventListener(button2.eventListener.event, button2.eventListener.listener);
		modalButton2.style.display = "block";
	}

	showModal();
};

export function showModal() {
	let modal = document.getElementById("modal");
	if (modal) modal.style.display = "flex";
};

export function hideModal() {
	let modal = document.getElementById("modal");
	if (modal) modal.style.display = "none";
};

function createModal() {
	let container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
		container.style.cssText = `
			position: fixed; 
			top: 10px; 
			width: 440px; 
			z-index: 1000;
			display: flex; 
			justify-content: center; 
			align-items: center;`;
        document.body.appendChild(container);
    }
	
	let modal = document.createElement('div');
	modal.id = "modal";
	modal.style.cssText = `
		display: flex;
		position: fixed;
		top: 15%;
		left: 50%; 
		transform: translate(-50%, -50%);
		padding: 10px; 
		border-radius: 10px; 
		background-color: #dec4ec;
		opacity: 0;
		transition: opacity 0.5s;
		width: 400px; 
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 11px;
		opacity: 1;`;
	
	modal.innerHTML = `
		<h1 class="modal-title"></h1>
		<p class="modal-close-button" style="position: absolute; top: 10px; right: 10px; cursor: pointer;">x</p>
		<p class="modal-message"></p>
		<button class="modal-button-left" style="display: none;"></button>
		<button class="modal-button-right" style="display: none;"></button>
	`;

	container.appendChild(modal);
	
	const closeBut = document.querySelector('.modal-close-button');
	closeBut.addEventListener("click", hideModal);
};

function resetModal() {
	let modal = document.getElementById('modal');
	
	const modalTitle = modal.querySelector('.modal-title');
	modalTitle.textContent = '';
	
	const closeBut = modal.querySelector('.modal-close-button');
	const newCloseBut = closeBut.cloneNode(true); // Clone to reset event listeners
	closeBut.replaceWith(newCloseBut); // Replace with a fresh instance
	
	const modalMessage = modal.querySelector('.modal-message');
	modalMessage.textContent = '';
	
	let button1 = modal.querySelector('.modal-button-left');
	const newButton1 = button1.cloneNode(true);
	button1.replaceWith(newButton1);
	newButton1.style.display = "none";
	
	let button2 = modal.querySelector('.modal-button-right');
	const newButton2 = button2.cloneNode(true);
	button2.replaceWith(newButton2);
	newButton2.style.display = "none";
};
