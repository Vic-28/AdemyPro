const express = require('express');
const multer = require('multer');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importar cors

const app = express();
const PORT = 3000;

// Habilitar CORS
app.use(cors({
    origin: ['http://localhost:4200','*'], // Especifica el origen permitido
    methods: ['GET', 'POST'],       // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

// Configuración de Multer para manejar la subida de archivos
const upload = multer({ dest: 'uploads/' });

// Ruta principal
app.get('/', (req, res) => {
    res.send('Servidor Node.js funcionando');
});

// Endpoint para procesar el archivo ZIP
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const zip = new JSZip();

        // Leer el archivo subido
        const data = fs.readFileSync(filePath);
        const zipContent = await zip.loadAsync(data);

        const mp4Files = [];
        const chapterTitles = [];

        // Iterar por los archivos dentro del ZIP
        for (const relativePath in zipContent.files) {
            const file = zipContent.files[relativePath];

            // Procesar archivos MP4
            if (relativePath.startsWith('content/assets/') && file.name.endsWith('.mp4')) {
                const content = await file.async('nodebuffer');
                mp4Files.push({ name: file.name, content });
            }

            // Procesar archivos HTML
            if (file.name.endsWith('.html')) {
                const content = await file.async('string');
                const titles = extractTitles(content);
                chapterTitles.push(...titles);
            }
        }

        // Crear un nuevo ZIP con los archivos MP4
        const outputZip = new JSZip();
        mp4Files.forEach((file) => {
            outputZip.file(file.name, file.content);
        });

        const outputZipBuffer = await outputZip.generateAsync({ type: 'nodebuffer' });

        // Limpiar el archivo temporal subido
        fs.unlinkSync(filePath);

        // Enviar el ZIP generado y los títulos al cliente
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=mp4_files.zip',
        });
        res.send(outputZipBuffer);
    } catch (error) {
        console.error('Error procesando el archivo:', error);
        res.status(500).send('Error procesando el archivo');
    }
});

// Función para extraer títulos de capítulos de contenido HTML
function extractTitles(htmlContent) {
    const matches = htmlContent.match(/"fileName":"([^"]*\.mp4)"/g);
    return matches ? matches.map((match) => match.match(/"fileName":"([^"]*\.mp4)"/)[1]) : [];
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
