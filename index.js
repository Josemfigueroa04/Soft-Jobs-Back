const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, () => console.log('Server running on port 3000'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: ' softjobs',
    password: '22921748',
    port: 5432
});

pool.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database');
    }
});

// Utilidad para verificar y decodificar el token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, 'unrKqOH3YiAHOueHkjabqhHxwQEVlw0UC7lBOAeiFl2gwymvqJRtUKY3NEXLbEP');
    } catch (error) {
        throw new Error('Token inválido');
    }
};

app.post('/usuarios', async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        const passwordEncriptada = await bcrypt.hash(password, 10);
        const values = [email, passwordEncriptada, rol, lenguage];
        const consulta = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *';
        const { rows } = await pool.query(consulta, values);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const values = [email];
        const consulta = 'SELECT * FROM usuarios WHERE email = $1';
        const { rows, rowCount } = await pool.query(consulta, values);

        if (rowCount === 0) {
            throw new Error('Credenciales inválidas');
        }

        const { password: passwordEncriptada } = rows[0];
        const passwordValida = await bcrypt.compare(password, passwordEncriptada);

        if (!passwordValida) {
            throw new Error('Credenciales inválidas');
        }

        const token = jwt.sign({ email }, 'unrKqOH3YiAHOueHkjabqhHxwQEVlw0UC7lBOAeiFl2gwymvqJRtUKY3NEXLbEP');
        res.json({ token });
        console.log(token);

    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const token = req.header("authorization");

        if (!token) {
            throw new Error('Token no proporcionado');
        }

        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        console.log(decodedToken);

        const values = [decodedToken.email];
        const consulta = 'SELECT * FROM usuarios WHERE email = $1';
        const { rows, rowCount } = await pool.query(consulta, values);

        if (rowCount === 0) {
            throw new Error('Usuario no encontrado');
        }

        res.json(rows[0]);
        
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: error.message });
    }
});




