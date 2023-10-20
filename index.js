const express = require('express');
const app = express();
const cors = require('cors');
const {Pool} = require('pg');

const jwt = require('jsonwebtoken');


app.use(cors());
app.use(express.json());
app.listen(3000, () => console.log('Server running on port 3000'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'softjobs',
    password: '22921748',
    port: 5432,
});

pool.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('Connected to database');
}
);

// Path: Back/index.js

app.post('/post/usuarios', async (req, res) => {
    try {
        const {email, password, rol, lenguage} = req.body;
        const response = await pool.query('INSERT INTO usuarios ( email, password, rol, lenguage) VALUES ($1, $2, $3, $4)', [email,password, rol, lenguage]);
        res.json(response);
    } catch (error) {
        console.log(error);
    }
});

app.post('/post/login', async (req, res) => {
    try{
        


    }catch(error){
        console.log(error);
    }


});









