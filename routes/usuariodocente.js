const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de usuarios docentes
router.get("/", (req, res) => {
    const usuariodocente = req.app.db.get("usuariodocente").value(); // Cambiado a usuariodocente
    res.send(usuariodocente);
});

// Obtener un usuario docente por ID
router.get("/:id", (req, res) => {
    const usuariodocente = req.app.db.get("usuariodocente").find({ id: req.params.id }).value();
    
    if (!usuariodocente) {
        return res.sendStatus(404); // Usuario no encontrado
    }

    res.send(usuariodocente);
});

// Crear un nuevo usuario docente (sin validación de campos obligatorios)
router.post("/", (req, res) => {
    console.log("Datos recibidos:", req.body); // Depuración

    try {
        const nuevoUsuarioDocente = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("usuariodocente").push(nuevoUsuarioDocente).write(); // Cambiado a usuariodocente
        
        res.status(201).send(nuevoUsuarioDocente); // Respuesta de creación exitosa
    } catch (error) {
        console.error("Error al crear el usuario docente:", error); // Depuración
        return res.status(500).send({ error: "Error al crear el usuario docente", details: error.message });
    }
});

// Actualizar un usuario docente
router.put("/:id", (req, res) => {
    try {
        const usuariodocente = req.app.db
            .get("usuariodocente") // Cambiado a usuariodocente
            .find({ id: req.params.id });

        if (!usuariodocente.value()) {
            return res.sendStatus(404); // Usuario no encontrado
        }

        usuariodocente.assign(req.body).write();

        res.send(usuariodocente.value()); // Responder con el usuario actualizado
    } catch (error) {
        console.error("Error al actualizar el usuario docente:", error); // Depuración
        return res.status(500).send({ error: "Error al actualizar el usuario docente", details: error.message });
    }
});

// Eliminar un usuario docente por ID
router.delete("/:id", (req, res) => {
    const usuariodocente = req.app.db
        .get("usuariodocente") // Cambiado a usuariodocente
        .find({ id: req.params.id });

    if (!usuariodocente.value()) {
        return res.sendStatus(404); // Usuario no encontrado
    }

    req.app.db.get("usuariodocente").remove({ id: req.params.id }).write();
    res.sendStatus(200); // Respuesta de eliminación exitosa
});

module.exports = router;
