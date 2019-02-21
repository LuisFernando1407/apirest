const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

	const authHeader = req.headers.authorization;

	if(!authHeader){
		return res.status(401).json({error: 'No token provider'});
	}

	const parts = authHeader.split(' ');

	if(!parts.length === 2){
		return res.status(401).json({error: 'Token error'});
	}

	const [ type, token ] = parts;


	if(!/^Bearer$/i.test(type)){
		return res.status(401).json({error: 'Token malformated'});
	}


	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if(err) return res.status(401).json({error: 'Token invalid'});

		req.userId = decoded.id;

		return next();
	});

}