import { validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from '../../types';

/**
 * A middleware function that runs request validators and returns a 400 error response with
 * the validation errors if any of the validators fail.
 * @param validator An array of request validators to run.
 * @returns A middleware function that runs the specified validators and returns a 400 error
 * response with the validation errors if any of the validators fail.
 */
export default (validator: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Run all validators in parallel
        await Promise.all(validator.map((validate: any) => validate.run(req)));

        // Check if any of the validators failed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return a 400 error response with the validation errors
            return res.status(400).json({ error: errors.array() });
        }

        // If all validators passed, move on to the next middleware
        next();
    };
};
