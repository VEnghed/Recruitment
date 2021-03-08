
/**
 * Creates a table in the database called competence_profile
 * @param {*} Sequelize The tool used for connecting to database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeCompetenceProfile(Sequelize, DataTypes, person, competence) {
    return Sequelize.define('competenceprofile', {
        competence_profile_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        years_of_experience: {
            type: DataTypes.INTEGER,
            allownNull: false,
            validate: {
                notEmpty: true,
                isInt: true     
            }
        },}, {
            tableName: 'competenceprofile',
            timestamps: false
        }
    );
}

export { makeCompetenceProfile };