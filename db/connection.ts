import {Sequelize} from 'sequelize'

const db= new Sequelize('jaapman', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
    port:3306,
    define:{
        freezeTableName:true
    }
    //logging:false,
});





export default db;