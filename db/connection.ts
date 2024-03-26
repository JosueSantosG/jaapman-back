import {Sequelize} from 'sequelize'

const db= new Sequelize('jaapman', 'root', 'admin',{
    host: 'localhost',
    dialect: 'mysql',
    define:{
        //Para que sequelize no coloque sobrenombres en las tablas
        freezeTableName:true
    }
    //logging:false,
});





export default db;