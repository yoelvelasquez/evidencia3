const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de progresos
router.get("/", (req, res) => {
    const progresos = req.app.db.get("progreso").value(); // Cambiado a 'progreso'
    res.send(progresos);
});

// Obtener un progreso por ID
router.get("/:id", (req, res) => {
    const progreso = req.app.db.get("progreso").find({ id: req.params.id }).value(); // Cambiado a 'progreso'
    
    if (!progreso) {
        return res.sendStatus(404); // Si no se encuentra el progreso, devolver 404
    }

    res.send(progreso); // Devolver el progreso encontrado
});

// Crear un nuevo progreso
router.post("/", (req, res) => {
    console.log("Datos recibidos:", req.body); // Para depuración

    try {
        if (!req.body.usuarioId || !req.body.cursoId) { // Validar que los campos necesarios estén presentes
            return res.status(400).send({ error: "Los campos 'usuarioId' y 'cursoId' son obligatorios." });
        }

        const progreso = {
            id: nanoid(idLength), // Generar un ID único
            ...req.body, // Agregar el resto de los datos del progreso
        };

        req.app.db.get("progreso").push(progreso).write(); // Guardar el progreso en la base de datos
        
        res.status(201).send(progreso); // Enviar el progreso creado con código 201
    } catch (error) {
        return res.status(500).send({ error: "Error al crear el progreso", details: error.message });
    }
});

// Actualizar un progreso
router.put("/:id", (req, res) => {
    try {
        const updatedProgreso = req.app.db
            .get("progreso")
            .find({ id: req.params.id })
            .assign(req.body)
            .write();

        if (!updatedProgreso) {
            return res.sendStatus(404); // Si no se encuentra, enviar 404
        }

        res.send(req.app.db.get("progreso").find({ id: req.params.id }).value()); // Devolver el progreso actualizado
    } catch (error) {
        return res.status(500).send({ error: "Error al actualizar el progreso", details: error.message });
    }
});

// Eliminar un progreso por ID
router.delete("/:id", (req, res) => {
    try {
        const removedProgreso = req.app.db
            .get("progreso")
            .remove({ id: req.params.id })
            .write();

        if (!removedProgreso) {
            return res.sendStatus(404); // Si no se encuentra, enviar 404
        }

        res.sendStatus(200); // Devolver 200 si se eliminó correctamente
    } catch (error) {
        return res.status(500).send({ error: "Error al eliminar el progreso", details: error.message });
    }
});

module.exports = router;
