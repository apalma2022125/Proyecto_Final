import mongoose from 'mongoose';

const ProductsSchema = mongoose.Schema({
    nameProduct:{
        type: String,
        required: [true, 'The name is required']
    }, 
    description:{
        type: String,
        required: [true, 'The description is required']
    },
    price:{
        type: Number,
        required: [true, 'The price is required']
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    stock:{
        type: Number,
        required: [true, 'The stock is required when creating a product']
    },
    estado:{
        type: Boolean,
        default: true
    }
});

ProductsSchema.methods.toJSON = function(){
    const{ __v, _id, ...product} = this.toObject();
    product.PRODUCT_ID = _id;
    return product;
};

export default mongoose.model('Product', ProductsSchema);