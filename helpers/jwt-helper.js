/*
 * @Author: Dilshan Niroda
 * @Date: 2021-06-19 18:51:19
 * @Last Modified by: Dilshan Niroda
 * @Last Modified time: 2021-06-19 19:10:19
 */
const JWT = require("jsonwebtoken")
const createError = require("http-errors")

module.exports = {
	signAccessToken: userId => {
		return new Promise((resolved, rejected) => {
			const payload = {}
			const secret = process.env.ACCESS_TOKEN_SECRET
			const options = {
				expiresIn: "1h",
				issuer: "dilshann",
				audience: userId
			}
			JWT.sign(payload, secret, options, (err, token) => {
				if (err) {
					rejected(createError.InternalServerError())
				}
				resolved(token)
			})
		})
	},
	signRefreshToken: userId => {
		return new Promise((resolved, rejected) => {
			const payload = {}
			const secret = process.env.REFRESH_TOKEN_SECRET
			const options = {
				expiresIn: "1y",
				issuer: "dilshann",
				audience: userId
			}
			JWT.sign(payload, secret, options, (err, token) => {
				if (err) {
					rejected(createError.InternalServerError())
				}
				resolved(token)
			})
		})
	},
	verifyAccessToken: (req, res, next) => {
		const authHeader = req.headers["authorization"]
		if (!authHeader) return next(createError.Unauthorized())
		const token = authHeader.split(" ")[1]
		JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
			if (err) {
				const message =
					err.name === "TokenExpiredError" ? err.message : "Unauthorozied"
				next(createError.Unauthorized(message))
			}

			req.payload = payload
			next()
		})
	},
	verifyRefreshToken: refreshToken => {
		return new Promise((resolved, rejected) => {
			JWT.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				(err, payload) => {
					if (err) return rejected(createError.Unauthorized())
					const userId = payload.aud
					return resolved(userId)
				}
			)
		})
	}
}
