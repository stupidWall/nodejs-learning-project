
export default class UserMapper {
    static toUsers(users: any[]) {
        return users.map((user) => ({
            ...user.dataValues
        }));
    }
}
