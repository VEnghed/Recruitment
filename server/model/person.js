//instance of sequelize
/**
 * Creates a table in the database called person
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makePerson(Sequelize, DataTypes, Role) {
    return Sequelize.define('person', {
        pid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true, 
        },
        role: {
            type: DataTypes.INTEGER,
            allownNull: false,
            references: {
                model: Role,
                key: 'role_id',
            },
            validate: {
                notEmpty: true,
                isInt: true     
            }
        },
        firstname: {
            type: DataTypes.STRING,
            allownNull: false,
            validate: {
                notEmpty: true,  
                isAlpha: true
            }       
        },
        lastname: {
            type: DataTypes.STRING,
            allownNull: false, 
            validate: {
                notEmpty: true,  
                isAlpha: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allownNull: false,
            validate: {
                notEmpty: true,  
                isAlphanumeric: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allownNull: false,
            validate: {
                notEmpty: true,  
                isAlphanumeric: true 
            }
        },
        email: {
            type: DataTypes.STRING,
            allownNull: false,
            isEmail: true,
            validate: {
                notEmpty: true,  
                isEmail: true  
            }
        },
        ssn: {
            type: DataTypes.STRING,
            allownNull: false,
            validate: {
                notEmpty: true,  
            }
        }}, {
            tableName: 'person',
            timestamps: false
        }
    ); 
}

export { makePerson };
