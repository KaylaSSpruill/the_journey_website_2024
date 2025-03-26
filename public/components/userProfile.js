// src/components/userProfile.js

export function createUserProfile() {
	fetch('/user-data')
	.then(response => response.json())
	.then(user => {
		const headerEle = document.querySelector('.header');
		headerEle.style.cssText = `background-color: #404F24; color: #ffff; 
			padding: 10px; text-align: right; font-size: 1.0em;`;
		if (user) {
			const img = document.createElement('img');
			img.src = user.profile_pic;
			img.alt = "Profile Photo";
			img.className = "profile-photo";
			
			const dropdownDiv = document.createElement('div');
			dropdownDiv.className = "username-dropdown";
			
			const nameSpan = document.createElement('span');
			nameSpan.textContent = user.username;
			nameSpan.className = "profile-name";

			const ddContentDiv = document.createElement('div');
			ddContentDiv.className = "dropdown-content";
			
			const pUser = document.createElement('p');
			const aUser = document.createElement('a');
			aUser.href = '/user';
			aUser.textContent = "Profile";
			pUser.appendChild(aUser);
			
			const pSettings = document.createElement('p');
			const aSettings = document.createElement('a');
			aSettings.href = '/user';
			aSettings.textContent = "Settings";
			pSettings.appendChild(aSettings);
			
			const pLogout = document.createElement('p');
			const aLogout = document.createElement('a');
			aLogout.href = '/logout';
			aLogout.textContent = "Logout";
			pLogout.appendChild(aLogout);
			
			ddContentDiv.appendChild(pUser);
			ddContentDiv.appendChild(pSettings);
			ddContentDiv.appendChild(pLogout);
			
			dropdownDiv.appendChild(nameSpan);
			dropdownDiv.appendChild(ddContentDiv);
			
			headerEle.appendChild(img);
			headerEle.appendChild(dropdownDiv);
		} else {
			const pLogin = document.createElement('p');
			const aLogin = document.createElement('a');
			aLogin.href = "/login";
			aLogin.textContent = Login;
			pLogin.appendChild(aLogin);
			headerEle.appendChild(pLogin);
		}
	});
};