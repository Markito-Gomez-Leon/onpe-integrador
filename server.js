const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// 1. CARPETA PÚBLICA (Aquí viven tus HTML)
app.use(express.static('public'));

// 2. CONEXIÓN A BASE DE DATOS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'sistema_votos'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Motor de Base de Datos conectado exitosamente.');
});

// ==========================================
// 3. RUTAS DE VISTAS (Entregan las pantallas)
// ==========================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/votar', (req, res) => res.sendFile(path.join(__dirname, 'public', 'votar.html')));
app.get('/resultados', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultados.html')));

// ==========================================
// 4. RUTAS DE API REST (Procesan los datos)
// ==========================================

// API de Login
app.post('/api/login', (req, res) => {
    const { dni, nombre, apellido, fecha_emision, digito_verificador } = req.body;

    const horaActual = new Date().getHours(); 
    if (horaActual < 8 || horaActual >= 23) { 
        return res.json({ exito: false, mensaje: "⚠️ Las urnas se encuentran cerradas (8 AM - 4 PM)." });
    }
    
    const sql = `SELECT * FROM padron WHERE dni = ? AND nombre = ? AND apellido = ? AND fecha_emision = ? AND digito_verificador = ?`;
    db.query(sql, [dni, nombre, apellido, fecha_emision, digito_verificador], (err, result) => {
        if (err) return res.status(500).json({ exito: false, mensaje: "Error BD" });
        if (result.length === 0) return res.json({ exito: false, mensaje: "❌ Credenciales incorrectas." });
        if (result[0].estado === 'YA_VOTO') return res.json({ exito: false, mensaje: "⚠️ Elector inhabilitado. Ya registra voto." });
        
        res.json({ exito: true, mensaje: "Identidad verificada." });
    });
});

// API para Votar
app.post('/api/emitir-voto', (req, res) => {
    const { dni, idPartido } = req.body;
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ mensaje: "Error transacción" });
        db.query("UPDATE padron SET estado = 'YA_VOTO' WHERE dni = ? AND estado = 'PENDIENTE'", [dni], (err, result) => {
            if (err || result.affectedRows === 0) return db.rollback(() => res.status(400).json({ exito: false, mensaje: "Voto duplicado bloqueado." }));
            db.query("UPDATE partidos SET votos = votos + 1 WHERE id = ?", [idPartido], (err, result2) => {
                if (err) return db.rollback(() => res.status(500).json({ exito: false, mensaje: "Error conteo." }));
                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ exito: false, mensaje: "Error commit." }));
                    res.json({ exito: true, mensaje: "Voto registrado exitosamente." });
                });
            });
        });
    });
});

// API de Resultados (Con Simulador de Segunda Vuelta)
app.get('/api/resultados', (req, res) => {
    
    // --- SIMULADOR DE TIEMPO ---
    // Cambia el "new Date().getHours()" por un número fijo (ej. 17) para forzar la Segunda Vuelta
    const horaActual = new Date().getHours(); 
    
    let faseEleccion = 1; // Fase 1 normal
    
    // Si son las 4 PM (16 hrs) o más, pasamos a Balotaje
    if (horaActual >= 23) { 
        faseEleccion = 2; 
    }

    // Consulta SQL base
    let sql = "SELECT nombre, votos FROM partidos ORDER BY votos DESC";
    
    // Si estamos en Fase 2, le decimos a MySQL que corte a los 2 primeros
    if (faseEleccion === 2) {
        sql += " LIMIT 2";
    }

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ mensaje: "Error al leer escrutinios." });
        
        // Enviamos al Frontend no solo los votos, sino en qué fase estamos
        res.json({
            fase: faseEleccion,
            escrutinio: result
        });
    });
});

app.listen(3000, () => console.log('🚀 Sistema Electoral (MVC) corriendo en http://localhost:3000'));