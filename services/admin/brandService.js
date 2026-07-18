const Brand = require("../../models/Brand");

const addBrand = async({ name, slug, description, image, isActive }) =>{
    const existingBrand = await Brand.findOne({
        name: { $regex: `^${name.trim()}$`, $options: "i"},
        isDeleted: false,
    });

    if(existingBrand){
        throw { status: 409, message: "Brand already exists."};
    }

    const finalSlug = slug ? slug.trim().toLowerCase() : name.trim().toLowerCase().replace(/\s+/g, "-");

    const brand = await Brand.create({
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || "",
        image,
        isActive,
    });

    return brand;
}

const getAllBrands = async({ search, status, page, limit })=>{
    const skip = (page - 1) * limit;

    const filter = {
        isDeleted: false,
    }

    if(search && search.trim() !== ""){
        filter.name = {
            $regex: search.trim(),
            $options: "i",
        }
    }

    if(status === "active"){
        filter.isActive = true;
    }else if(status === "inactive"){
        filter.isActive = false;
    }

    const totalBrands = await Brand.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalBrands / limit));

    const brands = await Brand.find(filter)
    .sort({ createdAt: -1})
    .skip(skip)
    .limit(limit);

    return { brands, totalBrands, totalPages };
}

const getBrandById = async(id) =>{
    const brand = await Brand.findOne({
        _id: id,
        isDeleted : false,
    });

    return brand;
}

const updateBrand = async(id, { name, slug, description, image, isActive})=>{
    const brand = await Brand.findOne({
        _id: id,
        isDeleted: false,
    });

    if(!brand){
        throw{ status : 404, message: "Brand not found."}
    }

    const existingBrand = await Brand.findOne({
        _id: {  $ne: id},
        name: {
            $regex: `^${name.trim()}$`,
            $options: "i",
        },
        isDeleted: false,
    });

    if(existingBrand) {
        throw{ status: 409, message: "Brand already exists."}
    }

    brand.name = name.trim();
    brand.slug = slug ? slug.trim().toLowerCase() : name.trim().toLowerCase().replace(/\s+/g, "-");  
    brand.description = description?.trim() || "";

    if(image){
        brand.image = image;
    }

    brand.isActive = isActive;

    await brand.save();

    return brand;
}

const toggleBrandStatus = async(id)=>{
    const brand = await Brand.findOne({
        _id: id,
        isDeleted: false,
    });

    if(!brand){
        throw{ status: 404, message: "Brand not found."}
    }

    brand.isActive = !brand.isActive;

    await brand.save();

    return brand;
}

const deleteBrand = async(id)=>{
    const brand = await Brand.findOne({
        _id:id,
        isDeleted: false,
    });

    if(!brand){
        throw{ status: 404, message: "Brand not found."}
    }

    const timestamp = Date.now();
    
    brand.name = `${brand.name}-deleted-${timestamp}`;

    brand.isDeleted = true;
    brand.isActive = false;

    await brand.save();

    return brand;
}

module.exports = {
    addBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    toggleBrandStatus,
    deleteBrand, 
}