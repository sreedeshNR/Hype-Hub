const productService = require("../../services/admin/productService")
const brandService = require("../../services/admin/brandService")
const categoryService = require("../../services/admin/categoryService")
const { validateProduct, validateVariant} = require('../../utils/validate')


const getProducts = async(req,res,next)=>{
    try{
        const page = Number(req.query.page) || 1
        const limit = 10;
        const search = req.query.search || ''

        let query = { isDeleted: false};
        if(search){
            query.productName = { $regex: search, $options: "i"}
        }

        const { products, totalPages, currentPage} = await productService.getAllProducts(query, page, limit);

        res.status(200).render("admin/products",{
            title: "Products Management",
            admin: req.session.admin,
            products,
            totalPages,
            currentPage,
            search,
            success: req.session.adminSuccess || null,
            layout: false,
        })

        req.session.adminSuccess = null;
   
    }catch(error){
        next(error)
    }
}


const getAddProduct = async(req,res,next)=>{
    try{
        
        const categoryData = await categoryService.getAllCategories({ status: "active", page: 1, limit: 100})
        const brandData = await brandService.getAllBrands({ status: "active", page: 1, limit: 100,})


        res.status(200).render("admin/add-product",{
            title: "Add Product",
            admin: req.session.admin,
            categories: categoryData.categories || [],
            brands : brandData.brands || [],
            errors: {},
            formData : {},
            layout: false,
        })

    }catch(error){
        next(error);
    }
}


const postAddProduct = async(req,res,next)=>{
    try{
        const {
            productName, slug, categoryId, brandId, gender, description, color, regularPrice, salePrice,
            size, quantity
        } = req.body;


        let formattedSizes = [];
        if(Array.isArray(size) && Array.isArray(quantity)){
            for(let i = 0; i < size.length; i++){
                formattedSizes.push({
                    size: Number(size[i]),
                    quantity: Number(quantity[i])
                });
            }
        }else if(size && quantity){

            formattedSizes.push({size: Number(size), quantity: Number(quantity)});
        }


        const images = req.files ? req.files.map(file => file.path) : [];

        const productData = { productName, slug, categoryId, brandId, gender, description};
        const variantData = { color, regularPrice, salePrice, sizes: formattedSizes, images};


        const productErrors = validateProduct(productData)
        const variantErrors = validateVariant(variantData)
        const errors = { ...productErrors, ...variantErrors};


        if(req.uploadError){
            errors.images = req.uploadError
        }

        if(Object.keys(errors).length > 0){
            const categoryData = await categoryService.getAllCategories({ status: "active", page: 1, limit: 100});
            const brandData = await brandService.getAllBrands({ status: "active",page: 1, limit: 100})


            return res.status(400).render("admin/add-product",{
                title: "Add Product",
                admin: req.session.admin,
                categories: categoryData.categories || [],
                brands : brandData.brands || [],
                errors,
                formData: req.body,
                layout: false,
            });
        }

        await productService.addProduct(productData, variantData);

        req.session.adminSuccess = "Product and initial variant added successfully.";
        res.redirect("/admin/products");
    }catch(error){

        if(error.status === 409 || error.code === 11000){
            const categoryData = await categoryService.getAllCategories({status : "active", page: 1, limit: 100});
            const brandData = await brandService.getAllBrands({ status: "active", page: 1, limit: 100})


            return res.status(400).render("admin/add-product",{
                title: "Add Product",
                admin: req.session.admin,
                categories: categoryData.categories || [],
                brands: brandData.brands || [],
                errors: { productName: "A product with this name already exists."},
                formData: req.body,
                layout: false,
            })
        }

        next(error);
    }
}

const toggleProductStatus = async(req,res,next)=>{
    try{
        const productId = req.params.id;

        const isListed = await productService.toggleProductStatus(productId)

        req.session.adminSuccess = `Product successfully ${isListed ? 'listed' : 'unlisted'}.`;

        res.redirect("/admin/products")
    }catch(error){
        next(error)
    }
}


const getEditProduct = async(req,res,next)=>{
    try{
        const productId = req.params.id

        let { product, variant } = await productService.getProductById(productId)

        if (!variant) {
            console.log("⚠️ WARNING: Ghost product detected. No variant found for product:", productId);
            variant = {
                _id: "",
                color: "",
                regularPrice: "",
                salePrice: "",
                sizes: [],
                images: []
            };
        }

        const categoryData = await categoryService.getAllCategories({ status: "active", page: 1, limit: 100})
        const brandData = await brandService.getAllBrands({status: "active", page: 1, limit: 100})


        res.status(200).render("admin/edit-product",{
            title: "Edit Product",
            admin: req.session.admin,
            product: product,
            variant: variant,
            categories: categoryData.categories || [],
            brands: brandData.brands || [],
            errors: {},
            layout: false,
        })
    
    }catch(error){
        next(error)
    }
}



const postEditProduct = async(req,res,next) =>{
    try{
        const productId = req.params.id;
        const {
            productName,categoryId, brandId, gender, description, color,
            regularPrice, salePrice,size, quantity, variantId, existingImages,
        } = req.body;


        let formattedSizes = [];
        if(Array.isArray(size) && Array.isArray(quantity)){
            for(let i = 0; i< size.length; i++){
                formattedSizes.push({ size: Number(size[i]), quantity: Number(quantity[i])});
            }
        }else if(size && quantity){
            formattedSizes.push({ size: Number(size), quantity: Number(quantity)});
        }

        let parsedExistingImages = [];
        try{
            if(existingImages) parsedExistingImages = JSON.parse(existingImages);
        }catch(e){
            console.log("Error parsing existing images");
            
        }

        const newUploadImages = req.files ? req.files.map(file => file.path) : [];

        const finalImages = [...parsedExistingImages,...newUploadImages];

        const productData = { productName, categoryId, brandId, gender, description};
        const variantData = { color, regularPrice, salePrice, sizes: formattedSizes, images: finalImages};

        const productErrors = validateProduct(productData)
        const variantErrors = validateVariant(variantData)
        const errors = { ...productErrors, ...variantErrors}

        if(Object.keys(errors).length >0){
            const categoryData = await categoryService.getAllCategories({status:"active", page:1, limit: 100})
            const brandData = await brandService.getAllBrands({status:"active",page: 1, limit:100})

            return res.status(400).render("admin/edit-product",{
                title: "Edit Product",
                amdin: req.session.admin,
                product: { ...productData, _id: productId},
                variant: { ...variantData, _id: variantId},
                categories: categoryData.categories || [],
                brands: brandData.brands || [],
                errors,
                layout: false,
            })
        }


        await productService.updateProduct(productId, variantId, productData, variantData);

        req.session.adminSuccess = "Product updated successfully."
        res.redirect("/admin/products");
    
    }catch(error){
        if(error.status === 409 || error.code === 11000){
            const categoryData = await categoryService.getAllCategories({status: "active", page:1, limit: 100})
            const brandData = await brandService.getAllBrands({ status: "active", page: 1, limit: 100})


            return res.status(400).render("admin/edit-product",{
                title: "Edit Product",
                admin: req.session.admin,
                product: {...req.body, _id: req.params.id},
                variant: {...req.body, _id: req.body.variantId},
                categories: categoryData.categories || [],
                brands: brandData.brands || [],
                errors: { productName: "Another product with this name already exists."},
                layout: false,
            })

            next(error);
        }
    }
}


const deleteProduct = async(req,res,next)=>{
    try{
        const productId = req.params.id;

        await productService.deleteProduct(productId)

        req.session.adminSuccess = "Product deleted successfully."
        res.redirect("/admin/products")
    }catch(error){
        next(error);
    }
}

module.exports = {
    getProducts,
    getAddProduct,
    postAddProduct,
    toggleProductStatus,
    getEditProduct,
    postEditProduct,
    deleteProduct,
}