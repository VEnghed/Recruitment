/**
 * Creates a table in the database called competenceprofile
 * @param {*} Sequelize The tool used for connecting to database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeCompetenceProfile(Sequelize, DataTypes) {
    return Sequelize.define('competenceprofile', {
        competence_profile_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }, years_of_experience: {
            type: DataTypes.DOUBLE(4,2),
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