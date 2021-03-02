/**
 * Creates a table in the database called availability
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeApplicationstatus(Sequelize, DataTypes, person) {
    return Sequelize.define('applicationStatus', {
        application_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            //isIn: [['accepted','rejected','unhandled']],
            /* validate: {
                notEmpty: true,
                isAlpha: true     
            } */
        },
        person: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: person,
                // This is the column name of the referenced model
                key: 'pid',
            },
            validate: {
                notEmpty: true,
                isInt: true     
            }
        },
        application_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            validate: {
                notEmpty: true
            }
        }
        }, {
            tableName: 'applicationstatus',
            timestamps: false
        }
    );
} 
 
export { makeApplicationstatus };