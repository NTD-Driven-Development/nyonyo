export default (sequelize, Sequelize) => {
    const RoomMember = sequelize.define('RoomMember', {
        // 定義 Model 屬性
        room_id: {     　　　 // 欄位名稱
            type: Sequelize.STRING,  //  資料型態
            allowNull: false　　　// 能不能為空，預設是 true
        },
        m1: {
            type: Sequelize.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        m2: {
            type: Sequelize.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        m3: {
            type: Sequelize.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        m4: {
            type: Sequelize.STRING,
            allowNull: false
            // allowNull defaults to true
        }
    }, {
        // Other model options go here
    });

    return RoomMember;
};