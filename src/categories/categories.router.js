import { Router } from 'express';
import { check } from 'express-validator';
import {validarCampos} from '../middlewares/validar-campos.js';
import {validarJWT} from '../middlewares/validar-jwt.js'
import {existCategoryByType} from '../helpers/db-validators.js';

import {categoriesGet, categoryPut,categoriesPost,categoryDelete} from '../categories/categories.controller.js';
import {yourRole} from '../middlewares/validar-rol.js'

const router = Router();

router.get( "/",[ validarJWT, yourRole("ADMIN") ],categoriesGet);


router.put(
    "/:id",
    [
        validarJWT,
        yourRole("ADMIN"),
        check('id', 'This Id is Invalid').isMongoId(),
        check('id').custom(existCategoryByType),
        validarCampos
    ], categoryPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        yourRole("ADMIN"),
        check('id', 'This Id is Invalid').isMongoId(),
        check('id').custom(existCategoryByType),
        validarCampos
    ], categoryDelete
);

router.post(
    "/",
    [
        validarJWT, 
        yourRole("ADMIN"),      
        check('typeCategory', 'The category is required').not().isEmpty(),
        check('typeCategory').custom(existCategoryByType),
        check('description', 'The description is required').not().isEmpty(),
        validarCampos
    ], categoriesPost
);


export default router;