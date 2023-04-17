const { rejects } = require('assert');
const mysql = require('mysql');
const dbconfig = require('./dbconfig');
const db = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
})

module.exports = {
    //保存钱包信息
    async saveWallet(wallet) {
        return new Promise((res, rej) => {
            let sql = `insert into wallet values(null,'${wallet.address}','${wallet.privateKey}')`;
            db.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                    rej(err)
                } else {
                    res();
                }
            })
        })
    }
}