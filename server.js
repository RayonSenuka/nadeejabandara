const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'docs')));
app.use('/api', apiRoutes);

app.use((req, res) => res.status(404).send('Page not found'));

app.listen(PORT, () => console.log(`NADEEJA site running at http://localhost:${PORT}`));
