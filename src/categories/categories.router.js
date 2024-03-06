import { Router } from 'express';
import { check } from 'express-validator';
import {validarCampos} from '../middlewares/validar-campos.js';
import {validarJWT} from '../middlewares/validar-jwt.js;'
import {existCategoryByType} from '../helpers/db-validators.js';

import {categoriesGet, categoryPut,categoriesPost,categoryDelete} from '../categories/categories.controller.js';

const router = Router();

router.get( "/", validarJWT,categoriesGet);


router.put(
    "/:id",
    [
        validarJWT,
        check('id', 'This Id is Invalid').isMongoId(),
        check('id').custom(existCategoryByType),
        validarCampos
    ], categoryPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        check('id', 'This Id is Invalid').isMongoId(),
        check('id').custom(existCategoryByType),
        validarCampos
    ], categoryDelete
);

router.post(
    "/",
    [
        validarJWT,       
        check('typeCategory', 'The product is required').not().isEmpty(),
        check('typeCategory').custom(existCategoryByType),
        check('description', 'The description is required').not().isEmpty(),
        validarCampos
    ], categoriesPost
);
