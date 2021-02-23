
//instance of sequelize
function makeRole(Sequelize, DataTypes) {
    return Sequelize.define('role', {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true, 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }}, {
            tableName: 'role',
            timestamps: false
        }
    ); 
}

export { makeRole };