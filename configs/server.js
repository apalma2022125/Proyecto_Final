'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/user/user.routes.js'
import authRoutes from '../src/auth/auth.routes.js';
import categoryRoutes from '../src/categories/categories.router.js';
import bcryptjs from 'bcryptjs';
import User from '../src/user/user.model.js';

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/ProyectFinalApi/v1/user'
        this.authPath = '/ProyectFinalApi/v1/auth'
        this.categoriesPath = '/ProyectFinalApi/v1/categories'

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    async createAdmins() {
        const existsAdmin = await User.findOne({ role: 'ADMIN' });
    
        if (!existsAdmin) {
            const uAdmin = {
                nombre: 'admin',
                correo: 'admin@gmail.com',
                password: '111111',
                role: 'ADMIN',
            };
    
            const salt = bcryptjs.genSaltSync();
            uAdmin.password = bcryptjs.hashSync(uAdmin.password, salt);
    
            await User.create(uAdmin);
        }
    }
    

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.categoriesPath, categoryRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;