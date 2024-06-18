import DataTypes from "sequelize";

export default (sequelize, Sequelize) => {
    const PlayerGame = sequelize.define('player_game', {
        // 定義 Model 屬性
        player_id: {     　　　 // 欄位名稱
            type: Sequelize.STRING,  //  資料型態
            allowNull: false,　// 能不能為空，預設是 true
            unique: true
        },
        player_name: {
            type: Sequelize.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        game_id: {
            type: Sequelize.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        hand: {
            type: DataTypes.JSON,
            allowNull: true,
            // get: function () {
            //     return JSON.parse(this.getDataValue('value'));
            // },
            // set: function (value) {
            //     this.setDataValue('value', JSON.stringify(value));
            // },
            // allowNull defaults to true
        },
        vs: {
            type: Sequelize.STRING,
            allowNull: true
            // allowNull defaults to true
        },
        role: {
            type: Sequelize.STRING,
            allowNull: true,
            // allowNull defaults to true
        }
    }, {
        // Other model options go here
    });

    return PlayerGame;
};