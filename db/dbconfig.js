require('dotenv').config();
const passwd = process.env.DBPASSWD;
module.exports = {
    host: "127.0.0.1",
    user: "root",
    password: passwd,
    database: "wallet"
}