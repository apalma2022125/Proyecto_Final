import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { categoryAssignment,isProductValid,existingProduct,thereIsInStock,thereIsInPrice} from '../helpers/db-validators.js';
import { yourRole } from '../middlewares/validar-rol.js';

import {
productsGet,
productGetByName,
productsPut,
productPost,
productDelete,
inStock,
noStock,
bestSellingProducts
} from '../products/products.controller.js'

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        esRole("ADMIN"),
        check('nameProduct', 'The name of the product is required').not().isEmpty(),
        check('nameProduct').custom(existingProduct),
        check('description', 'The description of the product is required').not().isEmpty(),
        check('price', 'The price of the product is required').not().isEmpty(),
        check('price').custom(thereIsInPrice),
        check('category', 'The category of the product is required').not().isEmpty(),
        check('category').custom(categoryAssignment),
        check('stock', 'The stock of the product is required').not().isEmpty(),
        check('stock').custom(thereIsInStock),
        validarCampos
    ], productPost
);

router.get("/", productsGet);

router.get(
    "/:name",
    [
        validarJWT,
        yourRole("ADMIN"),
        check('name').custom(isProductValid),
    ],
    productGetByName
);

router.put(
    "/:name",
    [
        validarJWT,
        check('name').custom(isProductValid),
        check('price').custom(thereIsInPrice),
        check('category').custom(categoryAssignment),
        check('stock').custom(thereIsInStock),
        validarCampos
    ], productsPut
);

router.delete(
    "/:name",
    [
        validarJWT,
        esRole("ADMIN_ROLE"),
        check('name').custom(isProductValid),
        validarCampos
    ], productDelete
);


router.get(
    "/get/inStock",[validarJWT,esRole("ADMIN"),],inStock);

router.get(
    "/get/noStock",
    [
        validarJWT,
        esRole("ADMIN"),
    ],
    noStock
);

router.get(
    "/get/bestSellingProducts",
    [
        validarJWT,
        esRole("ADMIN"),
    ],
    bestSellingProducts
);

export default router;