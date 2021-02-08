import {makeRole} from './role'

//instance of sequelize
function makePerson(Sequelize, DataTypes) {
    const role = makeRole(Sequelize, DataTypes);
    return Sequelize.define('person', {
        pid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        role: {
            type: DataTypes.INTEGER,
            references: {
                model: role,
                key: 'role_id',
            },
            allownNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allownNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allownNull: false
        },
        username: {
            type: DataTypes.STRING,
            allownNull: false
        },
        password: {
            type: DataTypes.STRING,
            allownNull: false
        },
        email: {
            type: DataTypes.STRING,
            allownNull: false
        },
        ssn: {
            type: DataTypes.INTEGER,
            allownNull: false
        }}, {
            tableName: 'person',
            timestamps: false
        }
    ); 
}

export { makePerson };
