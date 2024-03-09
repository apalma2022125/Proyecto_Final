import { Router } from 'express';
import { check } from 'express-validator';
import {existingEmail,existsUserById, isRoleValid} from "../helpers/db-validators.js";
import {userGet, getUserById, userPut, userPost, deleteAccount} from "../user/user.controller.js";
import { validarCampos } from '../middlewares/validar-campos.js';
import {validarJWT} from '../middlewares/validar-jwt.js'
import {yourRole} from '../middlewares/validar-rol.js'

const router = Router();

router.get("/", userGet);

    router.get(
        "/:id",
        [
            check("id","This id is not valid").isMongoId(),
            check("id").custom(existsUserById),
            validarCampos,            
        ],getUserById);

        
        
router.put(
    "/:id",
    [
        validarJWT,
        yourRole("ADMIN"),
        check("id", "This id is not valid").isMongoId(),
        check("id").custom(existsUserById),
        check("role").custom(isRoleValid),
        validarCampos,
    ],userPut);


router.post(
     "/",
     [
         check("name", "The name cannot be empty").not().isEmpty(),
         check("password", "The password cannot be empty").not().isEmpty(),
         check("password", "The password must have minimmum 6 characters").isLength({min:6}),
         check("email", "The email cannot be empty").not().isEmpty(),           
         check("email", "Enter a valid email address").isEmail(),
         check("email").custom(existingEmail),        
          validarCampos,
    ],userPost);


    router.delete(
        "/deleteAccount/Client",
        [
            validarJWT,
            yourRole("CLIENT"),
            check("confirmation", "The password is required").not().isEmpty(),
            check("password", "The password is required").not().isEmpty(),
            validarCampos
        ], deleteAccount);

    export default router;