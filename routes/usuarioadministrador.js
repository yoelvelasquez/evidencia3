const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de usuarioadministradores
router.get("/", (req, res) => {
    const usuarioadministrador = req.app.db.get("usuarioadministrador").value(); // Agregar .value() aquí
    res.send(usuarioadministrador);
});

// Obtener un usuarioadministrador por ID
router.get("/:id", (req, res) => {
    const usuarioadministrador = req.app.db.get("usuarioadministrador").find({ id: req.params.id }).value();
    
    if (!usuarioadministrador) {
        return res.sendStatus(404); // Agregar return aquí
    }

    res.send(usuarioadministrador);
});

// Crear un nuevo usuarioadministrador
router.post("/", (req, res) => {
    console.log("Datos recibidos:", req.body); // Agregar esta línea para depuración

    try {
        const usuarioadministrador = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("usuarioadministrador").push(usuarioadministrador).write();
        
        res.status(201).send(usuarioadministrador); // Usa un código 201 para crear
    } catch (error) {
        return res.status(500).send({ error: "Error al crear el usuarioadministrador", details: error.message });
    }
});

// Actualizar un usuarioadministrador
router.put("/:id", (req, res) => {
    try {
        const usuarioadministrador = req.app.db
            .get("usuarioadministrador")
            .find({ id: req.params.id });

        if (!usuarioadministrador.value()) {
            return res.sendStatus(404);
        }

        usuarioadministrador.assign(req.body).write();

        res.send(usuarioadministrador.value()); // Asegúrate de usar .value() aquí
    } catch (error) {
        return res.status(500).send({ error: "Error al actualizar el usuarioadministrador", details: error.message });
    }
});

// Eliminar un usuarioadministrador por ID
router.delete("/:id", (req, res) => {
    const usuarioadministrador = req.app.db
        .get("usuarioadministrador")
        .find({ id: req.params.id });

    if (!usuarioadministrador.value()) {
        return res.sendStatus(404);
    }

    req.app.db.get("usuarioadministrador").remove({ id: req.params.id }).write();
    res.sendStatus(200);
});

module.exports = router;
