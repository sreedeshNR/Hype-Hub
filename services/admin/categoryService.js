const Category = require("../../models/categoryModel")

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

module.exports = {
    addCategory,
    getAllCategories,
}