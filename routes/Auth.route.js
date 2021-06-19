/*
 * @Author: Dilshan Niroda
 * @Date: 2021-06-19 18:50:56
 * @Last Modified by: Dilshan Niroda
 * @Last Modified time: 2021-06-19 19:18:21
 */
const express = require("express")
const router = express.Router()
const createError = require("http-errors")
const User = require("../models/user.model")
const { authSchema } = require("../helpers/validation_schema")
const {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken
} = require("../helpers/jwt-helper")

/**
 * Register a user
 */
router.post("/register", async (req, res, next) => {
	try {
		const result = await authSchema.validateAsync(req.body)
		const doesExist = await User.findOne({ email: result.email })
		if (doesExist)
			throw createError.Conflict(`${result.email} has already been registered`)
		const user = new User(result)
		const savedUser = await user.save()
		const accessToken = await signAccessToken(savedUser.id)
		const refreshToken = await signRefreshToken(savedUser.id)

		res.status(201).json({ accessToken, refreshToken })
	} catch (error) {
		if (error.isJoi === true) error.status = 422
		next(error)
	}
})

/**
 * Login to the system
 */
router.post("/login", async (req, res, next) => {
	try {
		const result = await authSchema.validateAsync(req.body)
		const user = await User.findOne({ email: result.email })
		if (!user) throw createError.NotFound("User not registered")

		const isMatch = await user.isValidPassword(result.password)
		if (!isMatch)
			throw createError.Unauthorized("Usename/Password is not valid")
		const accessToken = await signAccessToken(user.id)
		const refreshToken = await signRefreshToken(user.id)
		res.json({ accessToken, refreshToken })
	} catch (err) {
		if (err.isJoi === true)
			return next(createError.BadRequest("Invalid Username/Password"))
		next(err)
	}
})

/**
 * Generating new pair of refresh token and access token
 */
router.post("/refresh-token", async (req, res, next) => {
	try {
		const { refreshToken } = req.body
		if (!refreshToken) throw createError.BadRequest()
		const userId = await verifyRefreshToken(refreshToken)
		const accessToken = await signAccessToken(userId)
		const refToken = await signRefreshToken(userId)
		res.json({ accessToken, refreshToken: refToken })
	} catch (err) {
		next(err)
	}
})

router.delete("/logout", (req, res, next) => {
	res.send("logout")
})

module.exports = router
