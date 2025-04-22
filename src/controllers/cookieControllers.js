
/**
 * checkAuthCookie - checks the existence of auth cookie.
 * !!Its priority does not exceeds existing session's data. 
 * Meaning if current session has user data stored, IT SHOULD NOT OVERWRITE THE SESSION DATA
 * This prevents automatic sign in that interrupts user's attempt to switch account. 
 */
function checkAuthCookie(req) {
	if (req.cookies.authToken) {
		console.log("Cookies exist!: ", req.cookies.authToken);
		//Check if session user name and id exists, if not sync the session
		if (!req.session.authToken) req.session.authToken = req.session.authToken;
	}
};

function getAuthCookie(req) {
	if (req.cookies.authToken) {
		return req.cookies.authToken;
	}
};

function cleanAuthCookie(req, res) {
	if (req.cookies.authToken) {
		if (req.cookies.authToken.maxAge <= Date.now()) {
			res.clearCookie('authToken');
		}
	}
};

module.exports = { 
	checkAuthCookie,
	getAuthCookie,
	cleanAuthCookie,
};