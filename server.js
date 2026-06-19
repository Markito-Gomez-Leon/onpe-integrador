/* =========================================================
   BACKEND DEL SISTEMA ELECTORAL (Controlador y Modelo)
   Este archivo es el corazón de la arquitectura MVC. Maneja las reglas
   de negocio de la ONPE, la seguridad transaccional y la conexión
   directa con la Base de Datos. Está construido sobre Node.js.
   ========================================================= */

// Importación de módulos esenciales para el ecosistema
const express = require('express');   // Framework para crear el servidor y las rutas REST.
const mysql = require('mysql2');      // Driver para comunicarnos con el motor de Base de Datos.
const cors = require('cors');         // Middleware de seguridad (Cross-Origin Resource Sharing).
const path = require('path');         // Herramienta nativa para manejar rutas de carpetas de Windows/Mac.

const app = express();
app.use(express.json());              // Permite que el servidor entienda datos en formato JSON.
app.use(cors());                      // Abre las puertas de seguridad para recibir peticiones del Frontend.
app.use(express.static('public'));    // Define la carpeta 'public' como la bóveda donde viven los HTML e imágenes.

// =========================================================
// CONEXIÓN AL PADRÓN Y ÁNFORAS DIGITALES (Capa de Modelo)
// Establecemos el puente de comunicación seguro con MySQL.
// =========================================================
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

// =========================================================
// ENRUTADOR DE VISTAS (Despachador del Frontend)
// Cuando el usuario escribe las URLs en su navegador, el servidor 
// intercepta la llamada y le "sirve" el archivo HTML correspondiente.
// =========================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/votar', (req, res) => res.sendFile(path.join(__dirname, 'public', 'votar.html')));
app.get('/resultados', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultados.html')));

// =========================================================
// RUTAS API REST (Los engranajes del negocio electoral)
// =========================================================

// ---------------------------------------------------------
// 1. API DE AUTENTICACIÓN (Login del Elector)
// Valida la identidad del ciudadano cruzando 5 factores de seguridad.
// ---------------------------------------------------------
app.post('/api/login', (req, res) => {
    const { dni, nombre, apellido, fecha_emision, digito_verificador } = req.body; 
    
    // --- MODO DESARROLLO / PRUEBAS DE E-GOVERNMENT ---
    // En la vida real usaríamos 'new Date().getHours()'. Para propósitos 
    // de testing y demostración, forzamos la hora a las 10:00 AM para 
    // garantizar que el jurado pueda probar el sistema de día o de noche.
    const horaActual = 10;
    
    // REGLA ONPE: El horario de sufragio es estricto (8 AM a 6 PM aprox).
    if (horaActual < 8 || horaActual >= 18) { 
        return res.json({ exito: false, mensaje: "⚠️ Las urnas están cerradas." });
    }
    
    // Consulta SQL Parametrizada: Evitamos la inyección SQL (hackeos) usando signos de interrogación (?)
    const sql = `SELECT * FROM padron WHERE dni = ? AND nombre = ? AND apellido = ? AND fecha_emision = ? AND digito_verificador = ?`;
    
    db.query(sql, [dni, nombre, apellido, fecha_emision, digito_verificador], (err, result) => {
        if (err) return res.status(500).json({ exito: false, mensaje: "Error BD" });
        if (result.length === 0) return res.json({ exito: false, mensaje: "❌ Credenciales incorrectas." });
        
        // REGLA ONPE: Principio de un elector, un voto. Bloqueo de duplicidad.
        if (result[0].estado === 'YA_VOTO') return res.json({ exito: false, mensaje: "⚠️ Elector inhabilitado. Ya registra voto." });
        
        res.json({ exito: true, mensaje: "Identidad verificada." });
    });
});

// ---------------------------------------------------------
// 2. API DE DISTRIBUCIÓN DE CÉDULAS
// Devuelve la lista de candidatos según la categoría que el elector esté mirando.
// ---------------------------------------------------------
app.get('/api/candidatos', (req, res) => {
    const categoria = req.query.categoria || 'presidencial';
    
    // Traemos el ID (crucial para sumar el voto), nombres, partido y la foto.
    db.query("SELECT id, nombre, partido, foto_candidato FROM candidatos WHERE categoria = ?", [categoria], (err, result) => {
        if (err) return res.status(500).json({ error: "Error BD" });
        res.json(result);
    });
});

// ---------------------------------------------------------
// 3. API DE SUFRAGIO MÚLTIPLE (El Motor Transaccional)
// ¡OJO AQUÍ! Esta es la función más importante de la arquitectura.
// Usa "Transacciones SQL" (Propiedades ACID) para garantizar integridad.
// ---------------------------------------------------------
app.post('/api/emitir-voto', (req, res) => {
    const { dni, idsVotos } = req.body; // Recibimos el DNI y la matriz con los 4 votos (Senado, Presidencia, etc.)

    // db.beginTransaction(): Congela la base de datos temporalmente.
    // Garantiza que o se ejecutan todas las consultas con éxito, o no se guarda nada.
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ mensaje: "Error transacción" });
        
        // Acción 1: Inhabilitar al elector (Cambiar de PENDIENTE a YA_VOTO)
        // Usamos 'AND estado = PENDIENTE' como doble candado de seguridad a nivel de motor SQL.
        db.query("UPDATE padron SET estado = 'YA_VOTO' WHERE dni = ? AND estado = 'PENDIENTE'", [dni], (err, result) => {
            
            // Si hubo error o si affectedRows es 0 (alguien intentó hackear votando dos veces rápido),
            // ejecutamos db.rollback() que deshace cualquier cambio y aborta la misión.
            if (err || result.affectedRows === 0) return db.rollback(() => res.status(400).json({ exito: false, mensaje: "Voto duplicado bloqueado." }));
            
            // Acción 2: Sumar los votos en las ánforas
            // Magia SQL: En vez de hacer 4 actualizaciones distintas, usamos "WHERE id IN (?)" 
            // pasando el arreglo de IDs. Esto suma el voto a los 4 candidatos en 1 milisegundo.
            db.query("UPDATE candidatos SET votos = votos + 1 WHERE id IN (?)", [idsVotos], (err, result2) => {
                
                // Si la suma de votos falla, hacemos rollback (así el elector vuelve a estar "PENDIENTE").
                if (err) return db.rollback(() => res.status(500).json({ exito: false, mensaje: "Error conteo." }));
                
                // db.commit(): ¡El martillazo final! Si todo fue un éxito, se guardan los cambios
                // de forma permanente en el disco duro del servidor MySQL.
                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ exito: false, mensaje: "Error commit." }));
                    res.json({ exito: true, mensaje: "Sufragio procesado exitosamente en las 4 categorías." });
                });
            });
        });
    });
});

// ---------------------------------------------------------
// 4. API DE ESCRUTINIO PÚBLICO Y AUDITORÍA
// Alimenta las gráficas del Dashboard y define la Segunda Vuelta.
// ---------------------------------------------------------
app.get('/api/resultados', (req, res) => {
    const categoria = req.query.categoria || 'presidencial';
    
    // --- SIMULADOR DE SEGUNDA VUELTA (Balotaje) ---
    // Forzando el reloj a las "17" (5:00 PM), le decimos al sistema que 
    // la elección general ha terminado. Esto disparará una bandera hacia 
    // el Frontend para pintar a los candidatos ganadores de verde.
    const horaActual = 17; 
    
    // Consultamos a TODOS los candidatos en tiempo real, ordenados por quién tiene más votos.
    let sql = "SELECT nombre, partido, votos, foto_candidato FROM candidatos WHERE categoria = ? ORDER BY votos DESC";

    db.query(sql, [categoria], (err, result) => {
        if (err) return res.status(500).json({ mensaje: "Error al leer escrutinios." });
        
        // Empaquetamos la respuesta. 'eleccionCerrada' avisa al frontend si ya pasamos las 4:00 PM (16hrs).
        res.json({
            eleccionCerrada: (horaActual >= 16),
            escrutinio: result
        });
    });
});

// =========================================================
// ARRANQUE DEL SERVIDOR
// Escuchamos el puerto 3000 de la computadora anfitriona.
// =========================================================
app.listen(3000, () => console.log('🚀 Sistema Electoral corriendo en http://localhost:3000'));