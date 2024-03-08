import Product from './products.model.js';
import Category from '../categories/categories.model.js';


export const productPost = async (req, res) => {
    const { nameProduct, description, price, category, stock } = req.body;
    const categoryFound = await Category.findOne({ nameCategory: category });
    const product = new Product({ nameProduct, description, price: parseInt(price), category: categoryFound._id, stock: parseInt(stock), totalSales: 0 });

    await product.save();

    res.status(200).json({
        product
    });
}

export const productsGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate({
                path: 'category',
                select: 'nameCategory description -_id'
            })
            .select('-estado')
            .select('-estado')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
}

export const productGetByName = async (req, res) => {
    const { name } = req.params;
    const product = await Product.findOne({ nameProduct: name });

    if (!product.estado) {
        res.status(400).json({
            msg: 'The product has been removed'
        });
    }

    res.status(200).json({
        product
    });
}

export const productsPut = async (req, res) => {
    const { name } = req.params;
    const { _id, estado, category, ...resto } = req.body;

    const product = await Product.findOne({ nameProduct: name });

    if (!product.estado) {
        return res.status(400).json({
            msg: "This product is not exist",
        });
    }

    const productUpdate = await Product.findByIdAndUpdate(product._id, resto, { new: true });

    res.status(200).json({
        msg: 'Your profuct has been Update',
        productUpdate
    });
}

export const productDelete = async (req, res) => {
    const { name } = req.params;
    const product = await Product.findOne({ nameProduct: name });

    if (!product.estado) {
        return res.status(400).json({
            msg: "The product is not exist",
        });
    }

    const productRemoved = await Product.findByIdAndUpdate(product._id, { estado: false });
    const userAuthenticated = req.usuario;

    res.status(200).json({
        msg: 'Your product has been removed',
        productRemoved,
        userAuthenticated
    });
}


export const inStock = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .select('-description')
            .select('-estado')
            .select('-category')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
}



export const noStock = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true, stock: 0 };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate({
                path: 'category',
                select: 'nameCategory description -_id'
            })
            .select('-estado')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
}

export const bestSellingProducts = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true, totalSales: { $ne: 0 } };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate({
                path: 'category',
                select: 'nameCategory description -_id'
            })
            .select('-estado')
            .sort({ totalSales: 1 })
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        products
    });
};