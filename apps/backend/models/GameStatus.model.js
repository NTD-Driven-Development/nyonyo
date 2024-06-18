export default (sequelize, Sequelize) => {
    const GameStatus = sequelize.define('game_status', {
        // 定義 Model 屬性
        game_id: {     　　　 // 欄位名稱
            type: Sequelize.STRING,  //  資料型態
            allowNull: false,　// 能不能為空，預設是 true
            unique: true
        },
        game_status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'wait'
            // allowNull defaults to true
        }
    }, {
        // Other model options go here
    });

    return GameStatus;
};