import express from 'express';
import cors from 'cors';
import {PORT} from './config/env.js';

console.log("Server listening on port " + PORT);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({

}))

export default app;