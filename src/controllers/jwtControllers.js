const jwt = require('jsonwebtoken');
const secretKey = 'journalweb';

/**
 * Create a jwt token
 * @param expiresTime - default to 1 hour
 * @param ...props - add to the jwt to sign
 */
function createToken(props, expiresTime = '1h') {
	const token = jwt.sign(props, secretKey, { expiresIn: expiresTime });
	console.log("This is the created token: ", token);
	return token;
}

function decodeToken(token) {
	const decoded = 
		jwt.verify(token, secretKey, (err, decoded) => {
			if (err) {
				return false;
			} else {
				console.log('Decoded Token: ', decoded);
				return decoded;
			}
		});
	return decoded;
}

module.exports = {
	createToken,
	decodeToken
};
