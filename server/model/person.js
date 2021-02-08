import { makeRole } from './role'

//instance of sequelize
function makePerson(Sequelize, DataTypes) {
    const role = makeRole(Sequelize, DataTypes);
    return Sequelize.define('person', {
        pid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true, 
            validate: {
                isInt: true     
            }
        },
        role: {
            type: DataTypes.INTEGER,
            references: {
                model: role,
                key: 'role_id',
            },
            validate: {
                isInt: true     
            },
            allownNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allownNull: false,
            validate: {
                isAlpha: true,  
                notEmpty: true,  
            }       
        },
        lastname: {
            type: DataTypes.STRING,
            allownNull: false, 
            validate: {
                isAlpha: true,  
                notEmpty: true,  
            }
        },
        username: {
            type: DataTypes.STRING,
            allownNull: false,
            validate: {
                isAlpha: true,  
                notEmpty: true,  
            }
        },
        password: {
            type: DataTypes.STRING,
            allownNull: false,
            validate: {
                isAlphanumeric: true,     
                notEmpty: true,  
            }
        },
        email: {
            type: DataTypes.STRING,
            allownNull: false,
            validate: {
                isEmail: true,           
                notEmpty: true,  
            }
        },
        ssn: {
            type: DataTypes.INTEGER,
            allownNull: false,
            isEmail: true,
            validate: {
               isInt:true
            }
        }}, {
            tableName: 'person',
            timestamps: false
        }
    ); 
}

export { makePerson };
