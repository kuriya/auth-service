/*
 * @Author: Dilshan Niroda
 * @Date: 2021-06-19 18:51:03
 * @Last Modified by:   Dilshan Niroda
 * @Last Modified time: 2021-06-19 18:51:03
 */
const Joi = require("@hapi/joi")

const authSchema = Joi.object({
	email: Joi.string().email().lowercase().required(),
	password: Joi.string().min(3).required()
})

module.exports = { authSchema }
