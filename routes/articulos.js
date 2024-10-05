const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de artículos
router.get("/", (req, res) => {
    const articulos = req.app.db.get("articulos").value(); // Agregar .value() aquí
    res.send(articulos);
});

// Obtener un artículo desde la ID
router.get("/:id", (req, res) => {
    const articulo = req.app.db.get("articulos").find({ id: req.params.id }).value();
    
    if (!articulo) {
        return res.sendStatus(404); // Agregar return aquí
    }

    res.send(articulo);
});

// Crear un nuevo artículo
router.post("/", (req, res) => {
    console.log("Datos recibidos:", req.body); // Agregar esta línea para depuración

    try {
        if (!req.body.nombre) { // Asegúrate de que el nombre esté presente
            return res.status(400).send({ error: "El campo 'nombre' es obligatorio." });
        }

        const articulo = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("articulos").push(articulo).write();
        
        res.status(201).send(articulo); // Usa un código 201 para crear
    } catch (error) {
        return res.status(500).send({ error: "Error al crear el artículo", details: error.message });
    }
});

// Actualizar un artículo
router.put("/:id", (req, res) => {
    try {
        req.app.db
            .get("articulos")
            .find({ id: req.params.id })
            .assign(req.body)
            .write();

        res.send(req.app.db.get("articulos").find({ id: req.params.id }).value()); // Asegúrate de usar .value() aquí
    } catch (error) {
        return res.status(500).send({ error: "Error al actualizar el artículo", details: error.message });
    }
});

// Eliminar un artículo con su ID
router.delete("/:id", (req, res) => {
    req.app.db // Cambiar de req.accepted.db a req.app.db
        .get("articulos")
        .remove({ id: req.params.id })
        .write();

    res.sendStatus(200);
});

module.exports = router;

