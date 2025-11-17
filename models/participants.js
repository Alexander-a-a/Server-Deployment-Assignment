module.exports = (sequelize, Sequelize) => {
    const Participant = sequelize.define('Participant', {
        email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstname: {
            type:  Sequelize.DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        dob: {
            type:  Sequelize.DataTypes.DATEONLY,
            allowNull: false
        }
    },{
        timestamps: false 
    });

    Participant.associate = function(models) {
        Participant.hasOne(models.Work);
        Participant.hasOne(models.Home);
    }
    return Participant
}