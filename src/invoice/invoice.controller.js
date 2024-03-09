import Product from '../products/products.model.js';
import Invoice from '../invoice/invoice.model.js';
import {thereAreEsxistences} from '../helpers/db-validators.js'


export const addToCart = async (req, res) => {
    try {
        const { productName, howManyProducts } = req.body;
        const userId = req.user._id;
        const product = await Product.findOne({ nameProduct: productName });

        if (!product || !product.estado) {
            return res.status(400).json({
                msg: 'This product is not exist'
            });
        }

        const validThereAreEsxistences = await thereAreEsxistences(productName, howManyProducts);

        if (!validThereAreEsxistences) {
            return res.status(400).json({
                msg: `Sorry we don't have stock of this product, but we have these products  ${product.stock} in stock`
            });
        }

        let car = await Invoice.findOne({ userId, estado: true });

        if (!car || !car.estado) {
            const newCar = new Invoice({
                shoppingCart: [{
                    product: product._id,
                    thereIsInStock: howManyProducts,
                    amountPayable: product.price * howManyProducts
                }],
                userId
            });

            await newCar.save();
            car = newCar;
        } else {
            const existingProduct = car.shoppingCart.find(item => item.product.toString() === product._id.toString());

            if (existingProduct) {
                const totalHowManyProducts = existingProduct.thereIsInStock + parseInt(howManyProducts);
                const validacionDeSuficienteStockDespues = await thereAreEsxistences(productName, totalHowManyProducts);

                if (!validacionDeSuficienteStockDespues) {
                    return res.status(400).json({
                        msg: `We don't have enough products to sell you. We only have ${product.stock} products in stock.`
                    });
                }

                existingProduct.thereIsInStock += parseInt(howManyProducts);
                existingProduct.amountPayable += parseInt(howManyProducts) * product.price;
            } else {
                carrito.shoppingCart.push({
                    product: product._id,
                    thereIsInStock: howManyProducts,
                    amountPayable: product.price * howManyProducts
                });
            }

            await car.save();
        }

        res.status(200).json({
            car
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
};

export const invoiceGet = async (req, res) => {
    try {
        const { limite, desde } = req.query;
        const userId = req.user._id;
        const query = { userId: userId, estado: true };

        const [total, invoices] = await Promise.all([
            Invoice.countDocuments(query),
            Invoice.find(query)
                .populate({
                    path: 'shoppingCart.product',
                    select: 'nameProduct price -_id'
                })
                .select('-estado')
                .select('-date')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            invoices
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
};


export const payProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const car = await Invoice.findById(id).populate('shoppingCart.product');

        if (!car.estado) {
            return res.status(400).json({
                msg: 'This invoice has already been cancelled'
            });
        }

        if (userId.toString() !== car.userId.toString()) {
            return res.status(400).json({
                msg: 'This is not your invoice, please provide an invoice that belongs to you.'
            });
        }

        for (const item of car.shoppingCart) {
            const product = item.product;
            const cantidadComprada = item.thereIsInStock;

            product.stock -= cantidadComprada;
            product.totalSales += cantidadComprada;
            await product.save();
        }

        car.estado = false;
        await car.save();

        res.status(200).json({
            msg: 'Your purchase was successful',
            car
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
};


export const invoicesHistory = async (req, res) => {
    try {
        const { limit, from } = req.query;
        const userId = req.user._id;
        const query = { userId, state: false };

        const [total, invoices] = await Promise.all([
            Invoice.countDocuments(query),
            Invoice.find(query)
                .populate({
                    path: 'carritoWithProducts.product',
                    select: 'nameProduct price -_id'
                })
                .select('-state')
                .select('-date')
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            total,
            invoices
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
};


export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, howManyProducts } = req.body;
        const product = await Product.findOne({ nameProduct: productName });

        const sufficientStockValidation = await thereAreEsxistences(productName, howManyProducts);
        if (!sufficientStockValidation) {
            return res.status(400).json({
                msg: `We don't have enough products to sell you. We only have ${product.stock} products in stock`,
            });
        }

        const invoice = await Invoice.findById(id);

        const existingProductIndex = invoice.shoppingCart.findIndex(item => item.product.toString() === product._id.toString());

        if (existingProductIndex !== -1) {
            invoice.shoppingCart[existingProductIndex].thereIsInStock = howManyProducts;
            invoice.shoppingCart[existingProductIndex].amountPayable = product.price * howManyProducts;
        } else {
            invoice.shoppingCart.push({
                product: product._id,
                thereIsInStock: howManyProducts,
                amountPayable: product.price * howManyProducts
            });
        }

        await invoice.save();

        res.status(200).json({
            msg: 'This INVOICE was UPDATED:',
            invoice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
};
