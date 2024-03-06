import Category from './categories.model.js';
import { response, request } from 'express';

export const categoriesGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categories
    });
}

export const categoryPut = async (req, res = response) =>{
    const { id } = req.params;
    const {_id, estado, ...resto } = req.body;

    const categoryUpdate = await Category.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        msg: 'Category has been update',
        categoryUpdate
    });

}


export const categoryDelete = async (req, res) => {
    const {id} = req.params;
    const category = await Category.findByIdAndUpdate(id, {estado: false});
    const userAuthenticated = req.usuario;

    res.status(200).json({
        msg: 'Category has been removed',
        category,
        userAuthenticated
    });
}


export const categoriesPost = async (req , res) => {
    const {typeCategory, description} = req.body;
    const category = new Category( {typeCategory, description} );

    await category.save();

    res.status(200).json({
        category
    });
}