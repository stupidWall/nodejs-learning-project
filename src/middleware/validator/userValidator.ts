import { body } from 'express-validator';
import validate from './validate';

const STRONG_PWD_CONFIG = {
    minLength: 6,
    minNumbers: 2,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 0,
    pointsPerRepeat: 0,
    pointsForContainingLower: 0,
    pointsForContainingUpper: 0,
    pointsForContainingNumber: 0,
    pointsForContainingSymbol: 0
};
const STRONG_PWD_MESSAGE = 'The password is not strong enough. It must have at least 6 characters, including 2 numbers, 1 uppercase letter, 1 lowercase letter, and 1 symbol.';

/**
 * This function returns an array of validators that can be used to validate user input when
 * creating or updating a user. The validators will depend on the specified type.
 * @param type The type of validators to return. Can be either 'add' or 'update'.
 * @returns An array of validators that can be used to validate user input.
 */
const getValidators = (type: 'add' | 'update') => {
    const validators = [];

    if (type === 'add') {
        validators.push(
            body('login').notEmpty().withMessage('login is required').bail(),
            body('password')
                .notEmpty()
                .withMessage('password is required')
                .isStrongPassword(STRONG_PWD_CONFIG)
                .withMessage(STRONG_PWD_MESSAGE)
                .bail(),
            body('age')
                .notEmpty()
                .withMessage('age is required')
                .bail()
                .isInt({ min: 4, max: 130 })
                .withMessage('age must be between 4 and 130')
                .bail()
        );
    } else if (type === 'update') {
        validators.push(
            body('password')
                .optional()
                .isStrongPassword(STRONG_PWD_CONFIG)
                .withMessage(STRONG_PWD_MESSAGE)
                .bail(),
            body('age')
                .optional()
                .isInt({ min: 4, max: 130 })
                .withMessage('age must be between 4 and 130')
                .bail()
        );
    }

    return validators;
};

export const createUser = validate(getValidators('add').filter(Boolean));

export const updateUser = validate([
    body('id')
        .notEmpty()
        .withMessage('id is required')
        .bail(),
    ...getValidators('update').filter(Boolean)
]);
