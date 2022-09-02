import express from 'express';
import cors from 'cors'
import moviesRouter from './api/movies.route.js';

// create our express application: app
const app = express();

//In this case, the middleware used handles Cross-Origin Resource Sharing (CORS) requests and let's us work with JSON in Express
app.use(cors());
app.use(express.json());

// all request with this prefix will sent to movies (imported above)
app.use("/api/v1/movies", moviesRouter);
app.use('*', (req, res) => {
    res.status(404).json({error: "not found"});
})

export default app;


