import express from 'express';
import mongoose from 'mongoose'
import logger from  'morgan';
import cors from 'cors';
import {restRouter} from "./api";

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/speed-team');
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(logger('dev'));
app.use('/api', restRouter);
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
   res.status(error.status || 500);
   return res.json({
       message: error.message
   });
});
