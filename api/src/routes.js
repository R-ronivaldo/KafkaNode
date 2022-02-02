import express from 'express';

import UserControllers from './controllers/UserControllers';

const routes = express.Router();

routes.get("/users", UserControllers.index);
routes.post("/users", UserControllers.store);

export default routes;