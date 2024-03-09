import mongoose from 'mongoose';

const InvoiceSchema = mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },

    shoppingCart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        thereIsInStock: {
            type: Number,
            required: true
        },
        amountPayable: {
            type: Number,
            required: true  
        }
    }],
});

InvoiceSchema.methods.toJSON = function(){
    const{ __v, _id, ...invoice} = this.toObject();
    invoice.INVOICE_id = _id;
    return invoice;
};

export default mongoose.model('Invoice', InvoiceSchema);