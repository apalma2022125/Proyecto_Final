import {response, request } from"express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';


export const userGet = async (req = request, res = response)=>{
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, users]= await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        users
    });
}



export const getUserById = async (req = request, res = response) =>{
    const {id} = req.params;
    const user = await User.findOne({_id: id});

    res.status(200).json({
        user
    })
}


export const userPut = async (req = request, res = response) => {
    const {id} = req.params;
    const {_id, password, google,email,...resto} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate(id, resto);
    const user = await User.findOne({_id: id});

    res.status(200).json({
        msg: 'The user has been update',
        user
    });
 }


export const userPost = async (req, res) =>{

    const {name, email, password} = req.body;
    const user = new User({name,email,password});

    const salt = bcryptjs.genSaltSync(); 
    user.password = bcryptjs.hashSync(password, salt);    

    await user.save();

    res.status(200).json({
        user
    });
}


export const userDelete = async (req = request, res = response) =>{

    const {id} = req.params;

    const user = await User.findByIdAndUpdate(id, {estado: false});
    const userAuthenticated = req.user;

    res.status(200).json({msg:'user has been removed',user,userAuthenticated});

}