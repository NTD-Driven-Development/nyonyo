export const HOST = "localhost";
export const USER = "postgres";
export const PASSWORD = "postgres";
export const DB = "nyonyo";
export const dialect = "postgres";
export const PORT = 5453;
export const pool = {
    max: 5, //　連結池中最大的 connection 數
    min: 0,
    acquire: 30000, //　連結 Timeout 時間(毫秒)
    idle: 10000 //　連結被釋放的 idle 時間(毫秒)
};

// const config = {
//     HOST: "localhost",
//     USER: "postgres",
//     PASSWORD: "postgres",
//     DB: "nyonyo",
//     dialect: "postgres",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// };

// export default config;