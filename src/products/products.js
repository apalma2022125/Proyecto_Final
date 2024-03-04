const {Schema, model} = require('mongoose');

const ProductsSchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    TypeP:{
        type:String,
        required:[true, 'The type of product is required']
    },
    quantity:{
        type:String,
        required: [true, 'The quantity is required']
    },
    expirationDate:{
        type:String,
        required: [true, 'The expirationDate is required']
    },
    estado:{
        type: Boolean,
        default: true
    }
});


module.exports = model('Product', ProductsSchema);