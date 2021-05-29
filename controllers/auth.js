const jwtDecode = 			require('jwt-decode')
const {conn} =              require('../db')
const userSchema = 	  		require('../models/User.js')
const signToken = 			require('../auth').signToken
const signSimpleToken = 	require('../auth').signSimpleToken
const {jokes} = 			require('../data/jokes.js')
const { g, b, gr, r, y } =  require('../console')

exports.auth = {
	// list all users
	list: async (req, res) => {
		let url = process.env.ATLAS_AUTH
		let db = await conn(url)		
		let User = db.model('User', userSchema)
		User.find({}, (err, users) => {
			res.json(users)
		})
	},
	// a simple utility which returns a jwt - intended to be used
	// with postman for testing
	generate: (req, res) => {
		const {name, email, password} = req.body
		let token = signSimpleToken({name, email, password})
		res.send(token)
	},

	// you'll note in the routes that this function is behind the firewall
	show: async (req, res) => {		
		let userProfile = jwtDecode(req.body.id)
		
		let joke = jokes[Math.floor(Math.random() * jokes.length)]
		// note we execute .lean() to convert a mongoose document to js doc
		let url = process.env.ATLAS_AUTH
		let db = await conn(url)
		let User = db.model('User', userSchema)

		let doc = await User.find({email: userProfile.email}).lean()		
		if (doc.length === 0 || err) {
			doc = []
			doc.push(userProfile)			
			doc[0].joke = joke
		} else {
			doc[0].joke = joke
		}					
		res.json(doc)
	},

	// create a new user
	create: async (req, res) => {	
		let url = process.env.ATLAS_AUTH
		let db = await conn(url)		
		let User = db.model('User', userSchema)
		User.create(req.body, async (err, user) => {
			if(err) return res.json({success: false, code: err.code})
			// once user is created, generate a JWT and return to client"
			const token = signToken(user)
			res.json({success: true, message: "User created. Token attached.", token})

		})
	},

	// update an existing user
	update: async (req, res) => {
		let url = process.env.ATLAS_AUTH
		let db = await conn(url)		
		let User = db.model('User', userSchema)
		User.findById(req.params.id, (err, user) => {
			Object.assign(user, req.body)
			user.save((err, updatedUser) => {
				res.json({success: true, message: "User updated.", user})
			})
		})
	},

	// delete an existing user
	destroy: async (req, res) => {
		let url = process.env.ATLAS_AUTH
		let db = await conn(url)		
		let User = db.model('User', userSchema)
		User.findByIdAndRemove(req.params.id, (err, user) => {
			res.json({success: true, message: "User deleted.", user})
		})
	},

	// the login route
	authenticate: async (req, res) => {
		// check if the user exists
		let url = process.env.ATLAS_AUTH
		let db = await conn(url)		
		let User = db.model('User', userSchema)
	
		User.findOne({email: req.body.email}, (err, user) => {
			// if there's no user or the password is invalid
			if(!user || !user.validPassword(req.body.password)) {
				// deny access
				return res.json({success: false, message: "Invalid credentials."})
			}
			const {_id, name, email} = user.toJSON()  
			const token = signToken(user)
			res.json({ success: true, message: "Token attached.", id: _id, name, email, token })
		})
	},

	logout: (req, res) => {
		 // the token is removed from local storage client side
		 res.send({ message: "success" });
	}
}