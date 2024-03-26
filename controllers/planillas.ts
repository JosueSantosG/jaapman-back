import { Request, Response } from "express";
import Planillas from "../models/planillas";
import ResponsableLecturas from "../models/responsable_lecturas";
import Localidades from "../models/localidades";
import { Model, DataTypes, Sequelize, QueryTypes } from 'sequelize';
import Usuarios from "../models/usuarios";
import Medidores from "../models/medidores";
import Personas from "../models/personas";
import  db  from '../db/connection'; // asegúrate de que sea la ruta correcta

//Visualizar planillas
export const getPlanillas = async (req: Request, res: Response) => {
    const planillas = await Planillas.findAll();
    if (planillas.length > 0) {
        res.json({ planillas });
    } else {
        res.status(404).json({
        msg: "No existen planillas registradas",
        });
    }
};


// Se muestran los datos de la localidad y número de personas
export const getLocalidadxNumPersona = async (req: Request, res: Response) => {
    const { id_usuarioRol } = req.params;
    try {
        // Se realiza la consulta por el id_usuario_rol
        const localidadxUser = await db.query(`
        SELECT u.id_localidad, l.nombre, rl.id_usuario_rol,
            COUNT(u.id_persona) as total_personas
        FROM usuario u
            JOIN responsable_lectura rl ON u.id_localidad = rl.id_localidad
            JOIN localidad l ON u.id_localidad = l.id_localidad
        WHERE rl.id_usuario_rol = :usuarioRolId
        GROUP BY u.id_localidad, l.nombre, rl.id_usuario_rol;
        `, {
            replacements: { usuarioRolId: id_usuarioRol },
            type: QueryTypes.SELECT
        });
        if (localidadxUser.length > 0) {
            // Si existen datos obtenemos los resultados
            res.status(200).json({ resultados: localidadxUser });
        } else {
            
            res.status(200).json({ resultados: [] });
        }
    } catch (error) {
        // Si hay un error, se muestra un mensaje
        res.status(500).json({ mensaje: "Error al realizar la consulta" });
    }
};

//Se muestran todos los clientes de una localidad para la toma de lectura
export const getDatosClienteTomaLectura = async (req: Request, res: Response) => {
    const { id_localidad, id_usuario_rol } = req.params; 

    try {
        // Se realiza la consulta por el id_localidad (usuario) y id_usuario_rol (resp_lectura)
        const usuariosLectura = await db.query(`
        SELECT 
            rl.id_localidad, rl.id_responsable_lectura, med.codigo, rl.id_usuario_rol,rl.id_estado as estado_resp, 
            pl.lectura_actual, pl.lectura_anterior, pl.consumo_total, pl.observaciones, pl.estado_lectura , pl.nom_resp_edit as editadoPor,
            per.nombre,per.apellido,u.id_usuario
        FROM usuario u
            JOIN responsable_lectura rl ON u.id_localidad = rl.id_localidad
            JOIN medidor med ON u.id_medidor = med.id_medidor
            JOIN planilla pl ON u.id_usuario = pl.id_usuario
            JOIN persona per ON u.id_persona = per.id_persona
        WHERE u.id_localidad = :localidadId AND rl.id_usuario_rol = :id_usuario_rol;
        `, {
            replacements: { localidadId: id_localidad, id_usuario_rol: id_usuario_rol },
            type: QueryTypes.SELECT
        });
        if (usuariosLectura.length > 0) {
            // Si existen datos obtenemos los resultados
            res.status(200).json({ resultados: usuariosLectura });
        } else {
            res.status(200).json({ resultados: [] });
        }
    } catch (error) {
        res.status(500).json({ mensaje: "Error al realizar la consulta" });
    }
};


//Se actualiza los datos de lec_actual y anterior del usuario, por parte del operador
export const putPlanilla_ResponsableLectura = async (req: Request, res: Response) => {
    const {
        id_usuario,
        id_responsable_lectura, 
        editadoPor,
        estado_lectura,
        observaciones,
        lectura_actual }=req.body;

    try {
        
        // Buscar la fila existente por el id_usuario
        const verificarPlanilla: any = await Planillas.findOne({
            where: { id_usuario: id_usuario }
        });

        if (verificarPlanilla) {
            const consumo_total = lectura_actual - verificarPlanilla.lectura_anterior
            // Si la fila existe, se actualizan los campos
            await verificarPlanilla.update({
                id_responsable_lectura: id_responsable_lectura,
                id_estado_pago:2,
                observaciones:  observaciones,
                consumo_total:  consumo_total,
                lectura_actual: lectura_actual,
                estado_lectura: estado_lectura,
                nom_resp_edit:  editadoPor
            });

            res.status(200).json({ mensaje: "Datos actualizados"});
        } else {
            // Si no existe, da un error
            res.status(404).json({ mensaje: "No se encontró la persona con el ID proporcionado" });
        }
    } catch (error) {
        console.error("Error al guardar los datos:", error);
        throw error;
    }
};