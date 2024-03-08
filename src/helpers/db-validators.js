import User from '../user/user.model.js';
import Category from '../categories/categories.model.js';

export const isRoleValid = async (role = '') => {
    if (role !== "ADMIN" && role !== "CLIENT") {
        throw new Error(`This role is invalid`);
    }
};

export const existingEmail = async (email = '') => {
    const existeEmail = await User.findOne({email});
    if (existeEmail){
        throw new Error(`This email ${email} is already registered`);
    }
}

export const existsUserById = async (id = '') => {
    const existsUser = await User.findById(id);
    if (!existsUser){
        throw new Error(`The id ${id} not exist`);
    }
}

export const existCategoryByType = async (typeCategory ='') =>{
    const existsCategory = await Category.findOne({typeCategory});
    if(existsCategory){
        throw new Error(`This Category:${typeCategory} is al ready exist`);
    }
}




