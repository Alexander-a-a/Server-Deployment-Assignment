module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define('Admin', {
        username: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        password: {
            type:  Sequelize.DataTypes.STRING,
            allowNull: false
        }
    },{
        timestamps: false
    });
    return Admin
}