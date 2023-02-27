require('dotenv').config();
const passwd = process.env.MYSQL_PASSWD;

module.exports = {
    host: 'sh-cynosdbmysql-grp-nwjataqm.sql.tencentcdb.com',
    port: 20111,
    database: 'web3',
    user: 'root',
    password: passwd
}
