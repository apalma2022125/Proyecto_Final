import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existInvoiceById, isProductValid } from '../helpers/db-validators.js';
import { yourRole } from '../middlewares/validar-rol.js';

import {
    addToCart,
    invoiceGet,
    payProducts,
    invoicesHistory,
    updateInvoice
} from '../invoice/invoice.controller.js'

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        yourRole("CLIENT"),
        check('productName', 'The name of the product is required').not().isEmpty(),
        check('productName').custom(isProductValid),
        check('howManyProducts', 'The quantity of products is required').not().isEmpty(),
        validarCampos
    ], addToCart
);

router.get("/",
    [
        validarJWT, 
        yourRole("CLIENT")
    ], invoiceGet
);

router.get(
    "/:id",
    [
        validarJWT, 
        yourRole("CLIENT"),
        check('id', 'Invalid ID, try another').isMongoId(),
        check('id').custom(existInvoiceById)
    ], payProducts
);

router.get(
    "/get/invoicesHistory",
    [
        validarJWT, 
        yourRole("CLIENT"),
    ], invoicesHistory
);

router.put(
    "/:id",
    [
        validarJWT,
        yourRole("ADMIN"),
        check('id', 'Invalid ID, try another').isMongoId(),
        check('id').custom(existInvoiceById),
        check('productName', 'The name of the product is required').not().isEmpty(),
        check('productName').custom(isProductValid),
        check('howManyProducts', 'The quantity of products is required').not().isEmpty(),
        validarCampos
    ], updateInvoice
);

export default router;