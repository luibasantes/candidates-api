const requestTimer = (req, res, next) => {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		console.log("Duration", duration);
	});

	next();
};

module.exports = requestTimer;
