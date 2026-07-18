const productService = require('../../services/user/productService');


const getShopPage = async (req, res, next) => {
    try {
        const shopData = await productService.getShopData(req.query);

        res.status(200).render('user/shop', {
            title: 'Shop - HypeHub',
            user: req.session.user || null,
            products: shopData.products,
            categories: shopData.categories,
            brands: shopData.brands,
            totalPages: shopData.totalPages,
            currentPage: shopData.currentPage,
            totalProducts: shopData.totalProducts,
            queryParams: req.query 
        });
    } catch (error) {
        next(error);
    }
};


const getProductDetailsPage = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const detailsData = await productService.getProductDetails(slug);

        if (!detailsData) {
            req.flash('error', 'This product is currently unavailable or out of stock.');
            return res.redirect('/shop');
        }

        res.status(200).render('user/product-details', {
            title: `${detailsData.product.productName} - HypeHub`,
            user: req.session.user || null,
            product: detailsData.product,
            variant: detailsData.variant,
            totalStock: detailsData.totalStock,
            relatedProducts: detailsData.relatedProducts
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getShopPage,
    getProductDetailsPage
};