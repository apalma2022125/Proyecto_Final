import User from '../user/user.model.js'

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

