const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a la Base de Datos XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'sistema_votos'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Base de datos conectada con éxito.');
});

// API: Validar Elector (HU-01)
app.post('/validar', (req, res) => {
    const dniIngresado = req.body.dni;
    
    // Consulta SQL parametrizada (Seguridad Fase 4)
    db.query("SELECT * FROM padron WHERE dni = ?", [dniIngresado], (err, result) => {
        if (err) return res.status(500).send("Error en la BD");
        
        if (result.length > 0) {
            const ciudadano = result[0];
            if (ciudadano.estado === 'YA_VOTO') {
                res.json({ exito: false, mensaje: "⚠️ Acceso denegado: Este DNI ya emitió su voto." });
            } else {
                res.json({ exito: true, mensaje: `✅ Bienvenido, ${ciudadano.nombre}. Puede pasar a la cabina.` });
            }
        } else {
            res.json({ exito: false, mensaje: "❌ DNI no encontrado en el padrón." });
        }
    });
});

// API: Emitir Voto Transaccional (ACID - HU-05)
app.post('/emitir-voto', (req, res) => {
    const { dni, idPartido } = req.body;

    // 1. Iniciamos la Transacción Segura
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ mensaje: "Error iniciando transacción" });

        // 2. Quitamos el pase al elector (Para evitar doble voto)
        db.query("UPDATE padron SET estado = 'YA_VOTO' WHERE dni = ? AND estado = 'PENDIENTE'", [dni], (err, result) => {
            // Si hay error o el DNI ya había votado, cancelamos todo (ROLLBACK)
            if (err || result.affectedRows === 0) {
                return db.rollback(() => res.status(400).json({ exito: false, mensaje: "Error: Intento de voto doble o inválido." }));
            }

            // 3. Sumamos el voto al partido
            db.query("UPDATE partidos SET votos = votos + 1 WHERE id = ?", [idPartido], (err, result2) => {
                // Si el motor falla sumando el voto, cancelamos todo (ROLLBACK)
                if (err) {
                    return db.rollback(() => res.status(500).json({ exito: false, mensaje: "Error registrando el voto." }));
                }

                // 4. Si ambos pasos salieron perfectos, Guardamos definitivamente (COMMIT)
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => res.status(500).json({ exito: false, mensaje: "Error al finalizar transacción." }));
                    }
                    res.json({ exito: true, mensaje: "Voto encriptado y registrado en la base de datos." });
                });
            });
        });
    });
});

// API: Escrutinio y Resultados
app.get('/resultados', (req, res) => {
    // Consultamos los partidos y los ordenamos por mayor cantidad de votos (DESC)
    db.query("SELECT nombre, votos FROM partidos ORDER BY votos DESC", (err, result) => {
        if (err) return res.status(500).json({ mensaje: "Error al leer los escrutinios." });
        res.json(result);
    });
});

app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));