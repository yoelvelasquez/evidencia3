const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de usuarios alumnos
router.get("/", (req, res) => {
    const usuarioalumno = req.app.db.get("usuarioalumno").value(); // Cambiado a usuarioalumno
    res.send(usuarioalumno);
});

// Obtener un usuario alumno por ID
router.get("/:id", (req, res) => {
    const usuarioalumno = req.app.db.get("usuarioalumno").find({ id: req.params.id }).value();
    
    if (!usuarioalumno) {
        return res.sendStatus(404); // Usuario no encontrado
    }

    res.send(usuarioalumno);
});

// Crear un nuevo usuario alumno
router.post("/", (req, res) => {
    console.log("Datos recibidos:", req.body); // Depuración

    try {
        // Validar que se reciban todos los campos necesarios
        const { nombre, apellido, email, idioma, nivel } = req.body;
        if (!nombre || !apellido || !email || !idioma || !nivel) {
            return res.status(400).send({ error: "Todos los campos son obligatorios." });
        }

        const nuevoUsuarioAlumno = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("usuarioalumno").push(nuevoUsuarioAlumno).write(); // Cambiado a usuarioalumno
        
        res.status(201).send(nuevoUsuarioAlumno); // Respuesta de creación exitosa
    } catch (error) {
        console.error("Error al crear el usuario alumno:", error); // Depuración
        return res.status(500).send({ error: "Error al crear el usuario alumno", details: error.message });
    }
});

// Actualizar un usuario alumno
router.put("/:id", (req, res) => {
    try {
        const usuarioalumno = req.app.db
            .get("usuarioalumno") // Cambiado a usuarioalumno
            .find({ id: req.params.id });

        if (!usuarioalumno.value()) {
            return res.sendStatus(404); // Usuario no encontrado
        }

        usuarioalumno.assign(req.body).write();

        res.send(usuarioalumno.value()); // Responder con el usuario actualizado
    } catch (error) {
        console.error("Error al actualizar el usuario alumno:", error); // Depuración
        return res.status(500).send({ error: "Error al actualizar el usuario alumno", details: error.message });
    }
});

// Eliminar un usuario alumno por ID
router.delete("/:id", (req, res) => {
    const usuarioalumno = req.app.db
        .get("usuarioalumno") // Cambiado a usuarioalumno
        .find({ id: req.params.id });

    if (!usuarioalumno.value()) {
        return res.sendStatus(404); // Usuario no encontrado
    }

    req.app.db.get("usuarioalumno").remove({ id: req.params.id }).write();
    res.sendStatus(200); // Respuesta de eliminación exitosa
});

module.exports = router;
