const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de cursos
router.get("/", (req, res) => {
    const cursos = req.app.db.get("cursos").value(); // Obtener todos los cursos
    res.send(cursos); // Enviar la lista de cursos
});

// Obtener un curso por ID
router.get("/:id", (req, res) => {
    const curso = req.app.db.get("cursos").find({ id: req.params.id }).value(); // Buscar curso por ID
    
    if (!curso) {
        return res.sendStatus(404); // Si no se encuentra, enviar 404
    }

    res.send(curso); // Enviar el curso encontrado
});

// Crear un nuevo curso
router.post("/", (req, res) => {
    console.log("Datos recibidos:", req.body); // Para depuración

    try {
        if (!req.body.curso) { // Validar que el campo 'curso' esté presente
            return res.status(400).send({ error: "El campo 'curso' es obligatorio." });
        }

        const nuevoCurso = {
            id: nanoid(idLength), // Generar un ID único
            ...req.body, // Agregar el resto de los datos del curso
        };

        req.app.db.get("cursos").push(nuevoCurso).write(); // Guardar el curso en la base de datos

        res.status(201).send(nuevoCurso); // Enviar el curso creado con código 201
    } catch (error) {
        return res.status(500).send({ error: "Error al crear el curso", details: error.message });
    }
});

// Actualizar un curso
router.put("/:id", (req, res) => {
    try {
        const updatedCurso = req.app.db
            .get("cursos")
            .find({ id: req.params.id })
            .assign(req.body)
            .write(); // Actualizar el curso
        
        if (!updatedCurso) {
            return res.sendStatus(404); // Si no se encuentra, enviar 404
        }

        res.send(req.app.db.get("cursos").find({ id: req.params.id }).value()); // Devolver el curso actualizado
    } catch (error) {
        return res.status(500).send({ error: "Error al actualizar el curso", details: error.message });
    }
});

// Eliminar un curso por ID
router.delete("/:id", (req, res) => {
    try {
        const removedCurso = req.app.db
            .get("cursos")
            .remove({ id: req.params.id })
            .write(); // Eliminar el curso

        if (!removedCurso) {
            return res.sendStatus(404); // Si no se encuentra, enviar 404
        }

        res.sendStatus(200); // Enviar 200 si se eliminó correctamente
    } catch (error) {
        return res.status(500).send({ error: "Error al eliminar el curso", details: error.message });
    }
});

module.exports = router; // Exportar el router

