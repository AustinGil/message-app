import 'dotenv/config'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import fetch from 'node-fetch';
import api from './api/index.js'

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(api)

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.use((error, req, res, next) => {
  let status;

  // The Error contstructor is treated differently than a normal object
  const clientError = {
    name: error.name,
    message: error.message,
    status,
  };

  console.log(error);
  clientError.stack = error.stack;

  res.status(status || 500).json(clientError);
});

app.listen(3000);
console.log('Express started on port 3000');
