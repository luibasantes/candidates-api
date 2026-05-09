const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const passportJWT = require("passport-jwt");

const UserModel = require("../models/users");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { AUTH_USERNAME, AUTH_PASSWORD } = process.env;

passport.use(
	"general",
	new BasicStrategy((username, password, done) => {
		if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
			return done(null, { user: username });
		}
		return done(null, false);
	}),
);

passport.use(
	"jwt",
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || "SECRET",
		},
		async (jwtPayload, cb) => {
			try {
				const user = await UserModel.findOne({
					email: jwtPayload.email,
					deleted: false,
				});
				if (user) {
					return cb(null, user);
				} else {
					return cb(new Error("Auth not valid"));
				}
			} catch (error) {
				return cb(error);
			}
		},
	),
);

module.exports = passport;
