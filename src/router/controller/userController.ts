import { Request, Response } from 'express';
import UserService from '../../services/userServices';

const getUserById = async (req: Request<{userid: string}>, res: Response) => {
    const userid = req.params.userid;
    const user = await UserService.findUserById(userid);
    res.status(200).json({
        code: user ? 0 : -1,
        message: user ? null : `connot find user by id ${userid}`,
        data: user || null
    });
};

const getUsers = async (req: Request<any, any, any, {
    limit?: number,
    loginSubstring?: string
}>, res: Response) => {
    const { loginSubstring, limit } = req.query;
    const users = await UserService.getUsers(limit, loginSubstring);
    res.status(200).json({
        code: 0,
        message: null,
        data: users || []
    });
};

const createUser = async (req: Request, res: Response) => {
    const result = await UserService.insertUser(req.body);
    res.status(200).json({
        code: result?.status,
        message: result?.message,
        data: {
            userid: result?.userid
        }
    });
};

const updateUser = async (req: Request, res: Response) => {
    const result = await UserService.updateUser(req.body);
    res.status(200).json({
        code: result?.status,
        message: result?.message,
        data: null
    });
};

const deleteUser = async (req: Request<{userid: string}>, res: Response) => {
    const userid = req.body.userid;
    if (!userid) {
        res.status(200).json({
            code: 0,
            message: 'userid is required',
            data: null
        });
    }
    const result = await UserService.removeUser(userid);
    res.status(200).json({
        code: result?.status,
        message: result?.message,
        data: null
    });
};

export default {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
