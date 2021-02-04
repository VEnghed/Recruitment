import { Sequelize, DataTypes } from 'sequelize'

//instance of sequelize
var Db = new Sequelize(process.env.PG_URI);

const Person = Db.define('person', {
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
    }}
);

console.log(Person === Db.models.person); // person model is equal to the table in databsae
export default Person;
