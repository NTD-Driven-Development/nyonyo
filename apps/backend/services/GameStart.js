import db from "../models/index.js";
const RoomMember = db.roomMembers;

class GameStartService {
    async gameStart(data) {
        // 寫入對映欄位名稱的資料內容
        return await RoomMember.create({
            // 記得 value 字串要加上引號
            room_id: data.roomId,
            m1: data.member1,
            m2: data.member2,
            m3: data.member3,
            m4: data.member4,
        });
    }
}

export default new GameStartService();