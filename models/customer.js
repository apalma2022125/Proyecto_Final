const {Schema, model} = require('mongoose');

const CostumerSchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    Idetification:{
        type: String,
        default: "Cf"
    },
    methodOfPayment:{
        type:String,
        required: [true, 'The methodOfPayment is required']
    },
    estado:{
        type: Boolean,
        default: true
    }
});


module.exports = model('Invoice', InvoiceSchema);