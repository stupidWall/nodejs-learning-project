import { promisify } from 'util';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { User } from '../types';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const USERS_DB_FILE_PATH = path.join(__dirname, '../db/users.json');

interface UserModelResponse {
  status: 0 | -1;
  message?: string;
}

interface InsertResponse extends UserModelResponse {
  userid?: string;
}

type SuggestUserParams = {
    limit?: number;
    loginSubstring?: string;
}

class UserModel {
    private getActiveUsers(users: User[]) {
        return users.filter((user) => !user.isDeleted);
    }

    private getAutoSuggestUsers(
        users: User[],
        condition: SuggestUserParams
    ): User[] {
        const { limit, loginSubstring } = condition;

        let results: User[] = loginSubstring
            ? users.filter((user) => user.login.includes(loginSubstring))
            : users;

        results =
      typeof limit !== 'undefined' ? results.slice(0, Number(limit)) : results;

        return results;
    }

    async getUsers(suggestUserParams: SuggestUserParams = {}): Promise<User[]> {
        try {
            const { loginSubstring, limit } = suggestUserParams;
            const data = await readFile(USERS_DB_FILE_PATH, 'utf-8');
            const users = JSON.parse(data) as User[];
            const activeUsers = this.getActiveUsers(users);
            return this.getAutoSuggestUsers(activeUsers, { loginSubstring, limit });
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findUserById(userid: string) {
        const users = await this.getUsers();
        return users.find((userItem: User) => userItem.id === userid);
    }

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
            await writeFile(USERS_DB_FILE_PATH, JSON.stringify(newUsers));
            result.status = 0;
            result.message = 'insert ok';
            result.userid = userid;
            return result;
        } catch (error) {
            console.log(error);
            return result;
        }
    }

    private isLoginnameTaken(users: User[], name: string): boolean {
        return users.some((user) => user.login === name);
    }

    private generateLoginnameTakenResponse(
        result: UserModelResponse,
        name: string
    ) {
        result.status = -1;
        result.message = `${name} is already exists`;
        return result;
    }

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
            result.message = `id (${user.id}) is not exists.`;
            return result;
        }

        if (user.login && this.isLoginnameTaken(users, user.login)) {
            return this.generateLoginnameTakenResponse(result, user.login);
        }

        const updatedUser = {
            ...users[existingIdx],
            ...Object.fromEntries(
                Object.entries(user).filter(([, value]) => value !== undefined)
            )
        };

        users[existingIdx] = updatedUser;
        try {
            await writeFile(USERS_DB_FILE_PATH, JSON.stringify(users));
            result.status = 0;
            result.message = 'update ok';
            return result;
        } catch (error) {
            console.log(error);
            return result;
        }
    }

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

            await writeFile(USERS_DB_FILE_PATH, JSON.stringify(newUsers));

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
