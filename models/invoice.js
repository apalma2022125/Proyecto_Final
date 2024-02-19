const {Schema, model} = require('mongoose');

const InvoiceSchema = Schema({
    date:{
        type: String,
        required: [true, 'Date is required']
    },
    place:{
        type: String,
        required: [true, 'Place is reuired']
    },

    Dpi:{
        type:String,
        default: "CF"
    },
    purchase:{
        type:String,
        required: [true, 'The purchase is required']
    },
    amoout:{
        type:String,
        required: [true, 'The amoout is required']
    },
    estado:{
        type: Boolean,
        default: true
    }
});


module.exports = model('Invoice', InvoiceSchema);