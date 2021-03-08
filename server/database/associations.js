import pkg from "sequelize";
const { DataTypes } = pkg;

const makeAssociations = (Role, Person, Availability, ApplicationStatus, Competence, CompetenceProfile) => {
    console.log("IT WORKS")
    Role.hasMany(Person, { 
        foreignKey: {
            name: 'role',
            type: DataTypes.INTEGER,
            onDelete: 'CASCADE',
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true     
            }
        }
    });
    Person.hasMany(Availability, { 
        foreignKey: {
            name: 'person',
            type: DataTypes.INTEGER,
            onDelete: 'CASCADE',
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true     
            }
        }
    });
    Person.hasMany(ApplicationStatus, { 
        foreignKey: {
            name: 'person',
            type: DataTypes.INTEGER,
            onDelete: 'CASCADE',
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true     
            }
        }
    }); 
    Person.belongsToMany(Competence, { 
        through: CompetenceProfile, 
        foreignKey: 'person',
        type: DataTypes.INTEGER,
        allownNull: false,
        validate: {
            notEmpty: true,
            isInt: true
        } 
    });
    Competence.belongsToMany(Person, { 
        through: CompetenceProfile, 
        foreignKey: 'competence',
        type: DataTypes.INTEGER,
        allownNull: false,
        validate: {
            notEmpty: true,
            isInt: true     
        }
    });
}

export default { makeAssociations }