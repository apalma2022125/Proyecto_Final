import User from '../user/user.model.js';
import Category from '../categories/categories.model.js';
import Product from '../products/products.model.js';



export const isRoleValid = async (role = '') => {
    if (role !== "ADMIN" && role !== "CLIENT") {
        throw new Error('This role is invalid');
    }
};

export const isProductValid = async (nameProduct ='') =>{
    const existName = await Product.findOne({nameProduct});
    if(!existName){
        throw new Error('This product is invalid');
    }
}

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

export const existingProduct = async (nameProduct ='') =>{
    const existProduct = await Product.findOne({nameProduct});
    if(existProduct){
        throw new Error(`This Product:${nameProduct} is al ready exist`);
    }
}


export const existStock = async (nameProduct ='', productQuantity ='') =>{
    const existingProducts = await Product.findOne({nameProduct});
    if( existingProducts.stock < productQuantity){
        return false;
    }
    return true;
}


export const categoryAssignment = async (typeCategory ='') =>{
    const existsCategory = await Category.findOne({typeCategory});
    if(!existsCategory){
        throw new Error('This category is dont exist');
    }
}


export const thereIsInStock = async (stock = '')=>{
    if(stock < 0){
        throw new Error(`Are you okay, how are you going to get negative stock?`);
    }
}

export const thereIsInPrice = async (price = '')=>{
    if(price <= 0){
        throw new Error(`Are you okay, how are you going to get negative price?`);
    }
}

export const existInvoiceById = async (id = '') =>{
    const existInvoice = await Invoice.findById(id);
    if(!existInvoice){
        throw new Error('This invoice is not exist');
    }
}



export const thereAreEsxistences = async (nameProduct ='', howManyProducts ='') =>{
    const existingProduct = await Product.findOne({nameProduct});
    if( existingProduct.stock < howManyProducts){
        return false;
    }
    return true;
}




