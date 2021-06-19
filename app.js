const express = require("express")
const morgan = require("morgan")
const createError = require("http-errors")
const dotenv = require("dotenv").config()

const authRouter = require("./routes/Auth.route")
const { verifyAccessToken } = require("./helpers/jwt-helper")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.port || 3000

app.use(morgan("dev"))

console.log(dotenv.parsed)

/**
 * init database
 */

require("./helpers/init-mongo-db")()

/**
 * Routers
 */
app.use("/auth", authRouter)

app.get("/", verifyAccessToken, (req, res, next) => {
	//	req.headers["authorization"]

	res.send("Hello from express")
})

app.use((req, res, next) => {
	next(createError.NotFound("This route does not exist"))
})

app.use((err, req, res, next) => {
	res.status(err.status || 500)
	res.send({
		error: {
			status: err.status || 500,
			message: err.message
		}
	})
})

app.listen(port, () => {
	console.log(`Server started on port : ${port}`)
})
