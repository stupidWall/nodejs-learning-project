import { promisify } from 'util';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { User } from '../types';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const userJsonFilePath = path.join(__dirname, '../db/users.json');

interface UserModelResponse {
  status: 0 | -1;
  message?: string;
}

interface InsertResponse extends UserModelResponse {
  userid?: string;
}

/**
 * A class that provides methods for working with a list of users.
 */
class UserModel {
    /**
     * Returns a list of users that match the provided search criteria.
     * @param limit  The maximum number of users to return (optional)
     * @param loginSubstring  A string to match against user login names (optional)
     * @returns  A promise that resolves to an array of users
     */
    async getUsers(limit?: number, loginSubstring?: string): Promise<User[]> {
        try {
            const data = await readFile(userJsonFilePath, 'utf-8');
            const users = JSON.parse(data) as User[];
            let avaibleUsers = users.filter((user) => !user.isDeleted);

            avaibleUsers = loginSubstring
                ? this.filterByLoginSubstring(avaibleUsers, loginSubstring)
                : avaibleUsers;
            avaibleUsers = typeof limit !== 'undefined'
                ? this.applyLimit(avaibleUsers, limit)
                : avaibleUsers;
            return avaibleUsers;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    /**
     * Filters the given array of users by the given login substring
     * @param users - The array of users to filter
     * @param loginSubstring - The substring to use for filtering
     * @returns An array of users that have the given substring in their login
     */
    private filterByLoginSubstring(users: User[], loginSubstring: string) {
        return users.filter((user) => user.login.includes(loginSubstring));
    }

    /**
     * Limits the given array of users to the specified number
     * @param users - The array of users to limit
     * @param limit - The maximum number of users to return
     * @returns An array of users, with a maximum length of the given limit
     */
    private applyLimit(users: User[], limit: number) {
        return users.slice(0, Number(limit));
    }

    /**
     * Asynchronously retrieves a user with the given ID from the list of users
     * @param userid - The ID of the user to retrieve
     * @returns A promise that resolves to the user with the given ID, or undefined if no such user exists
     */
    async findUserById(userid: string) {
        const users = await this.getUsers();
        return users.find((userItem: User) => userItem.id === userid);
    }

    /**
     * Asynchronously inserts a new user with the given data
     * @param user - The data for the new user, excluding their ID
     * @returns A promise that resolves to an object indicating the status of the operation, including the ID of the new user if successful
     */
    async insertUser(user: Omit<User, 'id'>): Promise<InsertResponse> {
        const result: InsertResponse = {
            status: 0
        };

        const users = await this.getUsers();

        if (this.isLoginnameTaken(users, user.login)) {
            return this.generateLoginnameTakenResponse(result, user.login);
        }

        const userid = uuid();
        const newUser = Object.assign({ id: userid }, user);
        const newUsers = [...users, newUser];
        try {
            await writeFile(userJsonFilePath, JSON.stringify(newUsers));
            result.status = 0;
            result.message = 'insert ok';
            result.userid = userid;
            return result;
        } catch (error) {
            console.log(error);
            return result;
        }
    }

    /**
     * This function checks if a given username is already taken by another user.
     * @param {User[]} users - An array of users.
     * @param {string} name - The username to check.
     * @returns {boolean} - `true` if the username is taken, `false` otherwise.
     */
    private isLoginnameTaken(users: User[], name: string): boolean {
        return users.some(user => user.login === name);
    }

    /**
     * Generates a response indicating that the provided login name is already taken.
     * @param result  The user model response to modify
     * @param name  The login name that is already taken
     * @returns  The modified user model response with the appropriate error message
     */
    private generateLoginnameTakenResponse(result: UserModelResponse, name: string) {
        result.status = -1;
        result.message = `${name} is already exists`;
        return result;
    }

    /**
     * Asynchronously updates a user with the given data
     * @param user - The updated data for the user, including their ID
     * @returns A promise that resolves to an object indicating the status of the operation
     */
    async updateUser(
        user: {
      id: User['id'];
    } & Partial<Omit<User, 'id'>>
    ) {
        const result: UserModelResponse = {
            status: 0
        };

        const users = await this.getUsers();

        const existingIdx = users.findIndex((item) => item.id === user.id);

        if (existingIdx === -1) {
            result.status = -1;
            result.message = `${user.login} is not exists.`;
            return result;
        }

        if (user.login && this.isLoginnameTaken(users, user.login)) {
            return this.generateLoginnameTakenResponse(result, user.login);
        }

        const updatedUser = {
            ...users[existingIdx],
            ...Object.fromEntries(Object.entries(user).filter(([, value]) => value !== undefined))
        };

        users[existingIdx] = updatedUser;
        try {
            await writeFile(userJsonFilePath, JSON.stringify(users));
            result.status = 0;
            result.message = 'update ok';
            return result;
        } catch (error) {
            console.log(error);
            return result;
        }
    }

    /**
     * Asynchronously removes a user with the given ID from the list of users
     * @param id - The ID of the user to remove
     * @returns A promise that resolves to an object indicating the status of the operation
     */
    async removeUser(id: string): Promise<UserModelResponse> {
        const result: UserModelResponse = {
            status: 0
        };

        try {
            const users = await this.getUsers();

            const newUsers = users.map((userItem: User) => {
                if (userItem.id === id) {
                    userItem.isDeleted = true;
                    return userItem;
                }
                return userItem;
            });

            await writeFile(userJsonFilePath, JSON.stringify(newUsers));

            result.status = 0;
            result.message = 'remove ok';
        } catch (error) {
            result.status = -1;
            result.message = 'remove fail';
        }
        return result;
    }
}

export default new UserModel();
