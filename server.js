const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'sistema_votos'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ BD conectada con el nuevo sistema Bicameral.');
});

// ================= RUTAS DE VISTAS =================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/votar', (req, res) => res.sendFile(path.join(__dirname, 'public', 'votar.html')));
app.get('/resultados', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultados.html')));

// ================= RUTAS API REST =================

// 1. API Login
app.post('/api/login', (req, res) => {
    const { dni, nombre, apellido, fecha_emision, digito_verificador } = req.body; 
    // --- MODO DESARROLLO / PRUEBAS ---
    // Apagamos el reloj real para poder programar de noche
    // const horaActual = new Date().getHours(); 
    
    // Forzamos que el sistema crea que son las 10:00 AM
    const horaActual = 10;
    if (horaActual < 8 || horaActual >= 18) { 
        return res.json({ exito: false, mensaje: "⚠️ Las urnas están cerradas." });
    }
    
    const sql = `SELECT * FROM padron WHERE dni = ? AND nombre = ? AND apellido = ? AND fecha_emision = ? AND digito_verificador = ?`;
    db.query(sql, [dni, nombre, apellido, fecha_emision, digito_verificador], (err, result) => {
        if (err) return res.status(500).json({ exito: false, mensaje: "Error BD" });
        if (result.length === 0) return res.json({ exito: false, mensaje: "❌ Credenciales incorrectas." });
        if (result[0].estado === 'YA_VOTO') return res.json({ exito: false, mensaje: "⚠️ Elector inhabilitado. Ya registra voto." });
        
        res.json({ exito: true, mensaje: "Identidad verificada." });
    });
});

// 2. API: Cargar Cédulas Dinámicamente por Categoría
app.get('/api/candidatos', (req, res) => {
    const categoria = req.query.categoria || 'presidencial';
    db.query("SELECT id, nombre, partido, foto_candidato FROM candidatos WHERE categoria = ?", [categoria], (err, result) => {
        if (err) return res.status(500).json({ error: "Error BD" });
        res.json(result);
    });
});

// 3. API: Emitir Voto Múltiple (4 Categorías)
app.post('/api/emitir-voto', (req, res) => {
    const { dni, idsVotos } = req.body; // Ahora recibimos un arreglo de 4 IDs

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ mensaje: "Error transacción" });
        
        db.query("UPDATE padron SET estado = 'YA_VOTO' WHERE dni = ? AND estado = 'PENDIENTE'", [dni], (err, result) => {
            if (err || result.affectedRows === 0) return db.rollback(() => res.status(400).json({ exito: false, mensaje: "Voto duplicado bloqueado." }));
            
            // Magia SQL: Usamos "IN (?)" para sumar los votos a los 4 candidatos al mismo tiempo
            db.query("UPDATE candidatos SET votos = votos + 1 WHERE id IN (?)", [idsVotos], (err, result2) => {
                if (err) return db.rollback(() => res.status(500).json({ exito: false, mensaje: "Error conteo." }));
                
                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ exito: false, mensaje: "Error commit." }));
                    res.json({ exito: true, mensaje: "Sufragio procesado exitosamente en las 4 categorías." });
                });
            });
        });
    });
});

// 4. API: Escrutinio Dinámico y Resaltado de Ganadores
app.get('/api/resultados', (req, res) => {
    const categoria = req.query.categoria || 'presidencial';
    
    // --- SIMULADOR DE TIEMPO PARA LA EXPOSICIÓN ---
    // Si pones 10, es de día y las barras serán rojas normales.
    // Si pones 17, el sistema asume que terminó el sufragio y pintará a los ganadores de VERDE.
    const horaActual = 17; 
    
    // Consultamos a TODOS los candidatos, sin ocultar a nadie
    let sql = "SELECT nombre, partido, votos, foto_candidato FROM candidatos WHERE categoria = ? ORDER BY votos DESC";

    db.query(sql, [categoria], (err, result) => {
        if (err) return res.status(500).json({ mensaje: "Error al leer escrutinios." });
        
        // Enviamos los resultados y avisamos si la elección ya cerró (16 hrs o más)
        res.json({
            eleccionCerrada: (horaActual >= 16),
            escrutinio: result
        });
    });
});

app.listen(3000, () => console.log('🚀 Sistema Electoral corriendo en http://localhost:3000'));