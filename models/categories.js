const {Schema, model} = require('mongoose');

const CategoriesScema = Schema({

    typeCategory:{
        type:String,
        required: [true, 'The typeCategory is required']
    },
    Desc:{
        type:String,
        required:[true, 'The type of product is required']
    },
    codigo:{
        type:String,
        required: [true, 'The quantity is required']
    },

    estado:{
        type: Boolean,
        default: true
    }
});


module.exports = model('Product', ProductsSchema);