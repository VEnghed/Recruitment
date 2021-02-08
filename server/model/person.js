//instance of sequelize
/**
 * Creates a table in the database called person
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makePerson(Sequelize, DataTypes) {
    return Sequelize.define('person', {
        pid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        role: {
            type: DataTypes.INTEGER,
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