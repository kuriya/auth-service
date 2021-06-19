/*
 * @Author: Dilshan Niroda
 * @Date: 2021-06-19 11:21:52
 * @Last Modified by: Dilshan Niroda
 * @Last Modified time: 2021-06-19 18:02:35
 */

const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
})
/** Hasing password before saving in database */
UserSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10)
		const hashPassword = await bcrypt.hash(this.password, salt)
		this.password = hashPassword
		next()
	} catch (error) {
		next(error)
	}
})

/**
 * Validating the password
 */
UserSchema.methods.isValidPassword = async function (pass) {
	try {
		return await bcrypt.compare(pass, this.password)
	} catch (err) {
		throw err
	}
}

const User = mongoose.model("users", UserSchema)
module.exports = User
