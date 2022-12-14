export { Request, Response, NextFunction } from 'express';

export type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
};
