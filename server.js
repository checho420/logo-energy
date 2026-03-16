
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, 'src', 'data', 'products.json');

app.get('/api/products', (req, res) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error al leer productos' });
    }
});

app.post('/api/products', (req, res) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 4), 'utf-8');
        res.json({ message: 'Productos actualizados' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar productos' });
    }
});

app.listen(PORT, () => {
    console.log(`API Server running at http://localhost:${PORT}`);
});
