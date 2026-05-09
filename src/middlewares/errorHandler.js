const errorHandler = (err, _req, res, _next) => {
	console.log("Error Handle Log:", err);
	const status = err.statusCode || 500;
	res.status(status).json({
		message: "Error del servidor",
	});
};
module.exports = errorHandler;
