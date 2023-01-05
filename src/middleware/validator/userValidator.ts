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
const STRONG_PWD_MESSAGE = 'password is not strong enough;  minLength is 6; minNumbers is 2;  minUppercase is 1; minLowercase is 1; minSymbols is 1';

const getValidators = (type: 'add' | 'update') => {
    const results = [];
    const isAddType = type === 'add';
    const isUpdateType = type === 'update';
    if (isAddType) {
        results.push(
            body('login').notEmpty().withMessage('login is required').bail(),
            body('password').notEmpty().withMessage('password is required').isStrongPassword(STRONG_PWD_CONFIG).withMessage(STRONG_PWD_MESSAGE).bail(),
            body('age').notEmpty().withMessage('age is required').bail().isInt({ min: 4, max: 130 }).withMessage('age between 4 and 130').bail()
        );
    }
    if (isUpdateType) {
        results.push(
            body('password').optional().isStrongPassword(STRONG_PWD_CONFIG).withMessage(STRONG_PWD_MESSAGE).bail(),
            body('age').optional().isInt({ min: 4, max: 130 }).withMessage('age between 4 and 130').bail()
        );
    }
    return results;
};

export const createUser = validate(getValidators('add').filter(Boolean));

export const updateUser = validate([
    body('id').notEmpty().withMessage('id is required').bail(),
    ...getValidators('update').filter(Boolean)
]);
