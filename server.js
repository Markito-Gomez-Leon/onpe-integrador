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

// API: Validar Elector Multifactor (HU-01 Reforzada)
app.post('/validar', (req, res) => {
    // 1. Recibimos TODOS los datos de seguridad que manda el frontend
    const { dni, nombre, apellido, fecha_emision, digito_verificador } = req.body;

    // --- INICIO HU-05: Restricción de Horario Electoral ---
    const horaActual = new Date().getHours(); 
    
    if (horaActual < 8 || horaActual >= 23) {
        return res.json({ 
            exito: false, 
            mensaje: "⚠️ El horario de votación es de 8:00 AM a 4:00 PM. Las urnas se encuentran cerradas." 
        });
    }
    // --- FIN HU-05 ---
    
    // 2. Consulta SQL estricta (Cruza los 5 factores)
    const sql = `
        SELECT * FROM padron 
        WHERE dni = ? AND nombre = ? AND apellido = ? AND fecha_emision = ? AND digito_verificador = ?
    `;
    
    db.query(sql, [dni, nombre, apellido, fecha_emision, digito_verificador], (err, result) => {
        if (err) return res.status(500).json({ exito: false, mensaje: "Error en la BD" });
        
        // 3. Si no hay coincidencia exacta de los 5 datos, se bloquea (Evita suplantación)
        if (result.length === 0) {
            return res.json({ 
                exito: false, 
                mensaje: "❌ Datos de identidad incorrectos. Acceso denegado por seguridad." 
            });
        }

        const ciudadano = result[0];
        
        // 4. Validamos que el elector no sea un "voto golondrino" o duplicado (HU-06)
        if (ciudadano.estado === 'YA_VOTO') {
            res.json({ exito: false, mensaje: "⚠️ Acceso denegado: Este ciudadano ya emitió su voto." });
        } else {
            res.json({ exito: true, mensaje: `✅ Identidad confirmada. Bienvenido, ${ciudadano.nombre}. Aperturando cabina...` });
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