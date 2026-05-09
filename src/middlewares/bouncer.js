const boucer = (req, res, next) => {
	if (!req.hasReservation) {
		res.status(403).send("No pasaras");
	}
	next();
};

module.exports.boucer = boucer;
