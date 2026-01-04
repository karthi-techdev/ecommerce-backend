import Joi from 'joi';

export const profileUpdateSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email cannot be empty',
            'any.required': 'Email is required'
        })
});

export const passwordChangeSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .min(8)
        .messages({
            'string.empty': 'Current password cannot be empty',
            'string.min': 'Current password must be at least {#limit} characters long',
            'any.required': 'Current password is required'
        }),
    newPassword: Joi.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
            'string.empty': 'New password cannot be empty',
            'string.min': 'New password must be at least {#limit} characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
            'any.required': 'New password is required'
        }),
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .messages({
            'string.empty': 'Confirm password cannot be empty',
            'any.only': 'Passwords must match',
            'any.required': 'Confirm password is required'
        })
});