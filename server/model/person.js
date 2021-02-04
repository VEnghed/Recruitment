
//instance of sequelize
function makePerson(Sequelize, DataTypes) {
    return Sequelize.define('person', {
        role: {
            type: DataTypes.STRING,
            allownNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allownNull: false
        },
        lastName: {
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
            tableName: 'person'
        }
    );
}


export { makePerson };
