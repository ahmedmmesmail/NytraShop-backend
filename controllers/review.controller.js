import { json } from "express"
import { reviewModel } from "../models/review.model.js"
import joi from 'joi'

const reviewValidation = joi.object({
    text: joi.string().required().max(30).min(3).messages({
        'string.base': 'This field must be a valid text string.',
        'string.empty': 'This field cannot be empty.',
        'string.min': 'This field must be at least 3 characters long.',
        'string.max': 'This field cannot exceed 30 characters.',
    }),
    rating: joi.number().min(0).max(5).precision(1).messages({
        'number.base': 'This field must be a valid number.',
        'number.min': 'The value cannot be less than 0.',
        'number.max': 'The value cannot be greater than 5.',
        'number.precision': 'The number cannot have more than 1 decimal places.',
    }),
    userId: joi.string().alphanum().required().messages({
        'string.base': 'This field must be a valid text string.',
        'string.empty': 'This field cannot be empty.',
        'string.alphanum': 'This field must only contain alphanumeric characters (letters and numbers).',

    }),
    productId: joi.string().alphanum().required().messages({
        'string.base': 'This field must be a valid text string.',
        'string.empty': 'This field cannot be empty.',
        'string.alphanum': 'This field must only contain alphanumeric characters (letters and numbers).',

    })
})

export async function createReview(req, res) {
    let { text, rating, userID, productID } = req.body

    let { error } = reviewValidation.validate(req.body, { abortEarly: false, convert: false })

    if (error) {
        const allErrors = {}
        error.details.forEach(detail => {
            allErrors[detail.path[0]] = detail.message
        })

        return res.json({
            message: 'validation error',
            errors: allErrors
        })
    } else {
        let result = await reviewModel.insertMany({ text, rating, userID, productID })
        res.json({ message: 'added ', result })
    }
}

export async function getAllReviews(req, res) {
    let result = await reviewModel.find({})
    res.json({ message: result })
}

export async function updateReview(req, res) {
    let { _id, text, rating, userID, productID } = req.body

    let { error } = reviewValidation.validate(req.body, { abortEarly: false, convert: false })

    if (error) {
        const allErrors = {}
        error.details.forEach(detail => {
            allErrors[detail.path[0]] = detail.message
        })

        return res.json({
            message: 'validation error',
            errors: allErrors
        })
    } else {
        let result = await reviewModel.findOneAndReplace({ _id }, { text, rating, userID, productID }, { new: true })
        res.json({ message: 'success ', result })
    }
}
export async function deleteReview(req, res) {
    let { _id } = req.body
    let result = await reviewModel.findByIdAndDelete({ _id }, { new: true })
    res.json({ message: 'deleted ' })
}