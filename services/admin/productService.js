const Product = require("../../models/Product")
const Variant = require("../../models/Variant")

const addProduct = async(productData, variantData) =>{

    const searchTerm = String(productData.productName).trim();
    const existingProduct = await Product.findOne({
        productName: { $regex: `${searchTerm}$`, $options: "i"},
        isDeleted : false,
    });


    if(existingProduct){
        throw{ status: 409, message: "A product with this name already exists."}
    }


    const finalSlug = productData.slug ? productData.slug.trim().toLowerCase()
        :productData.productName.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g,"-")

    
    const product = await Product.create({
        productName: productData.productName.trim(),
        description: productData.description.trim(),
        slug: finalSlug,
        categoryId : productData.categoryId,
        brandId : productData.brandId,
        gender: productData.gender.toUpperCase(),
        isListed: true,
        
    });

    const variant = await Variant.create({
        productId : product._id,
        color: variantData.color.trim(),
        images: variantData.images,
        regularPrice: Number(variantData.regularPrice),
        salePrice: Number(variantData.salePrice),
        sizes: variantData.sizes,
    });

    return { product, variant};
}



const getAllProducts = async (query = {}, page = 1, limit = 10) =>{
    const skip = (page - 1) * limit;


    const products = await Product.find(query)
        .populate('categoryId', 'name')
        .populate('brandId','name')
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()

        const totalProducts = await Product.countDocuments(query)

        const productsWithVariants = await Promise.all(products.map(async(product)=>{
            const variant = await Variant.findOne({ productId: product._id}).lean();


            return {
                ...product,

                regularPrice: variant ? variant.regularPrice : 0,
                salePrice: variant ? variant.salePrice : 0,
                image: variant && variant.images && variant.images.length > 0 ? variant.images[0] : null,
            }
        }));


        return{
            products: productsWithVariants,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage : page,
        }
}



const toggleProductStatus = async(productId)=>{
    const product = await Product.findById(productId)

    if(!product){
        throw { status: 404, message: "Product not found."}
    }

    product.isListed = !product.isListed;

    await product.save();

    return product.isListed;
}


const getProductById = async(productId)=>{

    const product = await Product.findById(productId).lean()

    if(!product){
        throw{ status: 404, message: "Product not found."}
    }

    const variant = await Variant.findOne({productId: productId}).lean()

    return { product, variant};
}


const updateProduct = async(productId, variantId, productData, variantData) =>{

    const searchTerm = String(productData.productName).trim();
    const existingProduct = await Product.findOne({
        productName: {$regex:`^${searchTerm}&`, $options: "i"},
        _id: { $ne: productId},
        isDeleted: false,
    })

    if(existingProduct){
        throw{ status: 409, message: "Another product with this name alrready exists."}
    }

    const finalSlug = productData.productName.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g,"-")

    await Product.findByIdAndUpdate(productId,{
        productname: productData.productName.trim(),
        description: productData.description.trim(),
        slug: finalSlug,
        categoryId: productData.variantId,
        brandId: productData.brandId,
        gender: productData.gender.toUpperCase(),
    });


    await Variant.findByIdAndUpdate(variantId,{
        color: variantData.color.trim(),
        regularPrice: Number(variantData.regularPrice),
        salePrice: Number(variantData.salePrice),
        sizes: variantData.sizes,
        images: variantData.images,
    })

    return true;
}   



const deleteProduct = async(productId) =>{
    const product = await Product.findById(productId)

    if(!product){
        throw{ status: 404, message: "Product not found."}
    }

    product.isDeleted = true;

    product.isListed = false;

    await product.save()
    return true;
}

module.exports = {
    addProduct,
    getAllProducts,
    toggleProductStatus,
    getProductById,
    updateProduct,
    deleteProduct,
}