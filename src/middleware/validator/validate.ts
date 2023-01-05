import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from '../../types';

export default (validator: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validator.map((validate: any) => validate.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        next();
    };
};
