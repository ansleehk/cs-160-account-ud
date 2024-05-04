import express from 'express';
import cors from 'cors';
import router from './router.js';
import morgan from 'morgan';
import { errorHandlingMiddleware } from './middleware/restErrorHandler.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(morgan('combined'))


const CORS_OPTIONS = {
  origin: "*",
  methods: "PUT,DELETE"
};

app.use(cors(CORS_OPTIONS));


app.use(`/`, router);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});