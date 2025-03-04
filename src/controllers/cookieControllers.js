
/**
 * checkAuthCookie - checks the existence of auth cookie.
 * !!Its priority does not exceeds existing session's data. 
 * Meaning if current session has user data stored, IT SHOULD NOT OVERWRITE THE SESSION DATA
 * This prevents automatic sign in that interrupts user's attempt to switch account. 
 */
function checkAuthCookie(req) {
	if (req.cookies.username) {
		console.log("Cookies exist!: ", req.cookies.username);
		//Check if session user name and id exists, if not sync the session
		if (!req.session.username) req.session.username = req.cookies.username;
		if (!req.session.userId) req.session.userId = req.cookies.userId;
	}
};

function getAuthCookie(req) {
	if (req.cookies.username) {
		return req.cookies.username;
	}
};

module.exports = { 
	checkAuthCookie,
	getAuthCookie,
};