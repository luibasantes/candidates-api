const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usersModel = require("../models/users");

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await usersModel.findOne({ email, deleted: false });
	if (!user) {
		return res.status(401).send({ message: "Invalid Credentials" });
	}
	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		return res.status(401).send({ message: "Invalid Credentials" });
	}
	const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
		expiresIn: "15m",
	});
	res.send({ token, id: user._id });
};

const register = async (req, res) => {
	const { email, password } = req.body;
	const exist = await usersModel.findOne({ email, deleted: false });
	if (exist) {
		return res.status(409).send({ message: "Invalid Data" });
	}
	const hash = await bcrypt.hash(password, 10);
	const user = await usersModel.create({ email, password: hash });
	return res.send({ message: "Usuario creado", id: user._id });
};

exports.login = login;
exports.register = register;
