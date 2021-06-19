const mongoose = require("mongoose")

module.exports = () => {
	mongoose
		.connect(process.env.DATABASE_URI, {
			dbName: process.env.DATABASE_NAME,
			user: process.env.DATABASE_USERNAME,
			pass: process.env.DATABASE_PASSWORD,
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.then(() => {
			console.log("mongodb connected")
		})
		.catch(err => {
			console.log(err.message)
		})

	mongoose.connection.on("connected", () => {
		console.log("Mongoose connected to db")
	})

	mongoose.connection.on("error", err => {
		console.log(err.message)
	})

	mongoose.connection.on("disconnected", () => {
		console.log("mongoose disconnected from db")
	})

	process.on("SIGINT", async () => {
		await mongoose.connection.close()
		process.exit(0)
	})
}
