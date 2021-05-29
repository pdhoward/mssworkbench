const jwt = require('jsonwebtoken')
const User = require('../models/User.js')

// Note this is the super secret for signing the JWT
// this should be acquired via .env or a microservice
//import secret from env
const JWT_SECRET = process.env.JWT_SECRET;

// function for creating tokens from mongoose object
function signToken(user) {
	// toObject() returns a basic js object 
	// comprised of data from db. Delete password before creating jwt
	const userData = user.toObject()
	delete userData.password
	return jwt.sign(userData, JWT_SECRET)
}

// function for creating tokens from plain js object
function signSimpleToken(user) {	
	delete user.password
	return jwt.sign(user, JWT_SECRET)
}

// function for verifying tokens - this is the firewall
function verifyToken(req, res, next) {
	// grab token from either headers, req.body, or query string
	const token = req.get('token') || req.body.token || req.query.token
	// if no token present, deny access
	if(!token) return res.json({success: false, message: "No token provided"})
	// otherwise, try to verify token
	jwt.verify(token, JWT_SECRET, (err, decodedData) => {
		// if problem with token verification, deny access
		if(err) return res.json({success: false, message: "Invalid token."})
		// otherwise, search for user by id that was embedded in token
		User.findById(decodedData._id, (err, user) => {
			// if no user, deny access
			if(!user) return res.json({success: false, message: "Invalid token."})
			// otherwise, add user to req object
			req.user = user
			// go on to process the route:
			next()
		})
	})
}


// function for verifying access of a user based on their token
function verifyAccess(req, res, next) {
	// grab token from either headers, req.body, or query string
	const token = req.get('token') || req.body.token || req.query.token
	// if no token present, deny access
	if(!token) return res.json({success: false, message: "No token provided"})
	// otherwise, try to verify token
	jwt.verify(token, JWT_SECRET, (err, decodedData) => {
		// if problem with token verification, deny access
		if(err) return res.json({success: false, message: "Invalid token."})
		// otherwise, search for user by id that was embedded in token
		User.findById(decodedData._id, (err, user) => {
			// if no user, deny access
			if(!user) return res.json({success: false, message: "Invalid token."})
			// otherwise, return decoded object
			return res.json(decodedData)
		})
	})
}

module.exports = {
	signToken,
	signSimpleToken,
	verifyToken,
	verifyAccess
}