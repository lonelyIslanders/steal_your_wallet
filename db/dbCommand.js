const mysql = require('mysql');
const db_config = require('./dbConfig');
const db = mysql.createConnection({
    host: db_config.host,
    port: db_config.port,
    database: db_config.database,
    user: db_config.user,
    password: db_config.password
})

module.exports = {
    async insertWalletInfo(wallet) {
        const address = wallet.address;
        const privateKey = wallet.privateKey;
        let sql = `insert into web3 values(null,'${address}','${privateKey}')`;
        return new Promise((res, rej) => {
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    rej(err)
                }
            })
        })
    }




}