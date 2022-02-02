import { Model, DataTypes } from 'sequelize';

class User extends Model{
    static init(connection) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
        },{
            sequelize: connection
        })
    }
}

module.exports = User;