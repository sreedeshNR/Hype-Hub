const Product = require('../../models/Product');
const Variant = require('../../models/Variant');
const Category = require('../../models/Category');
const Brand = require('../../models/Brand');


const getShopData = async (queryData) => {
    const { search, category, brand, minPrice, maxPrice, sort, page = 1, limit = 9 } = queryData;

    const categories = await Category.find({ isActive: true, isDeleted: false }).lean();
    const brands = await Brand.find({ isActive: true, isDeleted: false }).lean();

    let productQuery = { isListed: true, isDeleted: false };

    if (search) {
        productQuery.productName = { $regex: search, $options: 'i' };
    }
    if (category) {
        productQuery.categoryId = category;
    }
    if (brand) {
        productQuery.brandId = brand;
    }

    let products = await Product.find(productQuery)
        .populate('categoryId', 'name')
        .populate('brandId', 'name')
        .lean();

    let productsWithVariants = [];
    for (let product of products) {
        const variant = await Variant.findOne({ productId: product._id }).lean();
        
        if (variant) {
            const price = variant.salePrice > 0 ? variant.salePrice : variant.regularPrice;
            
            const min = minPrice ? Number(minPrice) : 0;
            const max = maxPrice ? Number(maxPrice) : Infinity;

            if (price >= min && price <= max) {
                productsWithVariants.push({
                    ...product,
                    price: price,
                    regularPrice: variant.regularPrice,
                    image: variant.images && variant.images.length > 0 ? variant.images[0] : '/images/placeholder.jpg',
                    sizes: variant.sizes || []
                });
            }
        }
    }

    if (sort === 'price-low') {
        productsWithVariants.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        productsWithVariants.sort((a, b) => b.price - a.price);
    } else if (sort === 'a-z') {
        productsWithVariants.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (sort === 'z-a') {
        productsWithVariants.sort((a, b) => b.productName.localeCompare(a.productName));
    } else {
        productsWithVariants.sort((a, b) => b._id.toString().localeCompare(a._id.toString()));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = productsWithVariants.slice(startIndex, endIndex);
    const totalPages = Math.ceil(productsWithVariants.length / limit);

    return {
        products: paginatedProducts,
        categories,
        brands,
        totalPages,
        currentPage: Number(page),
        totalProducts: productsWithVariants.length
    };
};


const getProductDetails = async (slug) => {
    const product = await Product.findOne({ slug: slug })
        .populate('categoryId', 'name')
        .populate('brandId', 'name')
        .lean();

    if (!product || product.isListed === false || product.isDeleted === true) {
        return null; 
    }

    const variant = await Variant.findOne({ productId: product._id }).lean();
    if (!variant) {
        return null;
    }

    let totalStock = 0;
    if (variant.sizes && variant.sizes.length > 0) {
        totalStock = variant.sizes.reduce((acc, curr) => acc + curr.quantity, 0);
    }

    let relatedProductsRaw = await Product.find({
        categoryId: product.categoryId._id,
        _id: { $ne: product._id },
        isListed: true,
        isDeleted: false
    }).limit(4).lean();

    let relatedProducts = [];
    for (let relProd of relatedProductsRaw) {
        const relVariant = await Variant.findOne({ productId: relProd._id }).lean();
        if (relVariant) {
            relatedProducts.push({
                ...relProd,
                price: relVariant.salePrice > 0 ? relVariant.salePrice : relVariant.regularPrice,
                image: relVariant.images && relVariant.images.length > 0 ? relVariant.images[0] : '/images/placeholder.jpg'
            });
        }
    }

    return {
        product,
        variant,
        totalStock,
        relatedProducts
    };
};

module.exports = {
    getShopData,
    getProductDetails
};