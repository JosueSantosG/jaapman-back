"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Pago = connection_1.default.define('Pago', {
    id_pago: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_planilla: {
        type: sequelize_1.DataTypes.INTEGER
    },
    id_instalacion: {
        type: sequelize_1.DataTypes.INTEGER
    },
    id_mantenimiento: {
        type: sequelize_1.DataTypes.INTEGER
    },
    id_planilla_det: {
        type: sequelize_1.DataTypes.INTEGER
    },
    id_tipopago: {
        type: sequelize_1.DataTypes.INTEGER
    },
    id_estado_pago: {
        type: sequelize_1.DataTypes.INTEGER
    },
    abono_realizado: {
        type: sequelize_1.DataTypes.DOUBLE
    }
}, {
    tableName: 'pago',
});
exports.default = Pago;
//# sourceMappingURL=pago.js.map