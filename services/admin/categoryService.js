const Category = require("../../models/Category")

const addCategory = async({ name, description, image, isActive })=>{

    const existingCategory = await Category.findOne({
        name: { $regex: `^${name.trim()}$`, $options: "i" },
        isDeleted: false,
    })

    if(existingCategory){
        throw {status:409, message: "Category already exists."}
    };

    const slug = name.trim().toLowerCase().replace(/\s+/g,"-");

    const category = await Category.create({
        name: name.trim(),
        slug,
        description: description?.trim() || "",
        image,
        isActive,
    });

    return category;
}

const getAllCategories = async({ search, status, page, limit})=>{
    const skip = (page - 1) * limit;

    const filter = {
        isDeleted: false,
    }

    if(search && search.trim() !== ""){
        filter.name = {
            $regex : search.trim(),$options: "i",
        }
    }

    if(status === "active"){
        filter.isActive = true;
    }else if(status === "inactive"){
        filter.isActive = false;
    }

    const totalCategories = await Category.countDocuments(filter)

    const totalPages = Math.max(1, Math.ceil(totalCategories / limit));

        const categories = await Category.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return { categories, totalCategories, totalPages}
}


const getCategoryById = async(id) =>{
    const category = await Category.findOne({
        _id: id,
        isDeleted: false,
    });

    return category;
}


const updateCategory = async(id,{ name, description, image, isActive}) =>{
    
    const category = await Category.findOne({
        _id: id,
        isDeleted: false,
    });


    if(!category){
        throw{
            status: 404,
            message: "Category not found",
        }
    }

    const existingCategory = await Category.findOne({
        _id: { $ne : id},
        name: {
            $regex: `^${name.trim()}$`,
            $options: "i",
        },
        isDeleted: false,
    })

    if(existingCategory){
        throw { status: 409, message: "Category already exists."}
    }

    category.name = name.trim();
    category.slug = name.trim().toLowerCase().replace(/\s+/g,"-");
    category.description = description?.trim() || "" ;

    if(image){
        category.image = image;
    }

    category.isActive = isActive;

    await category.save()

    return category;
}


const toggleCategoryStatus = async(id)=>{

    const category = await Category.findOne({
        _id: id,
        isDeleted : false,
    });

    if(!category){
        throw{ status: 404, message: "Category not found."}
    }

    category.isActive = !category.isActive

    await category.save()

    return category;
}


const deleteCategory = async(id)=>{

    const category = await Category.findOne({
        _id: id,
        isDeleted: false,
    });

    if(!category){
        throw{ status: 404, message: "Category not found."}
    }

    category.isDeleted = true;

    await category.save();

    return category;
}

module.exports = {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
}