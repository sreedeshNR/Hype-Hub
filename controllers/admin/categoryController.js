const categoryService = require("../../services/admin/categoryService")
const { validateCategory } = require("../../utils/validate")


const getCategories = async(req,res,next)=>{
    try{
        const search = req.query.search ||"";
        const status = req.query.status || "";
        const page = Number(req.query.page) || 1;
        const limit = 5;

        const { categories, totalCategories, totalPages } = await categoryService.getAllCategories({
            search,
            status,
            page,
            limit,
        })

        const success = req.session.adminSuccess || null
        req.session.adminSuccess = null

        res.status(200).render("admin/categories", {
        title: "Category Management",
        admin: req.session.admin,
        categories,
        search,
        status,
        currentPage: page,
        totalPages,
        totalCategories,
        limit,
        success,
        layout: false,
        });
    }catch(error){
        next(error);
    }
}


const  getAddCategory = (req,res)=>{
    res.status(200).render("admin/add-category",{
        title: "Add Category",
        admin: req.session.admin,
        errors: {},
        formData: {},
        layout: false,
    });
}

const postAddCategory = async(req,res,next)=>{
    try{
        const { name, description, isActive} = req.body;

                console.log("Controller started");
                console.log(req.body);
                console.log(req.file);

        if (req.uploadError) {
            return res.status(400).render("admin/add-category", {
                title: "Add Category",
                admin: req.session.admin,
                errors: { general: req.uploadError },
                formData: req.body,
                layout: false,
            });
            }

        const errors = validateCategory({
            name,
            description,
        })

        console.log(errors);
        
         if (!req.file) {
             errors.image = "Category image is required.";
         }

        if(Object.keys(errors).length > 0){
            return res.status(400).render("admin/add-category",{
                title: "Add Category",
                admin: req.session.admin,
                errors,
                formData : req.body,
                layout : false,
            })
        }



        await categoryService.addCategory({
            name,
            description,
            image: req.file? req.file.path : "",
            isActive: isActive === "true",
        })

        console.log("Category saved");

        req.session.adminSuccess = "Category added successfully"

        res.redirect("/admin/categories")
    
    }catch(error){

        if(error.status === 409){
            return res.status(400).render("admin/add-category",{
                title: "Add Category",
                admin: req.session.admin,
                errors: {
                    name: error.message,
                },
                formData: req.body,
                layout: false,
            });
        }

        next(error);
    }
}

module.exports = {
    getCategories,
    getAddCategory,
    postAddCategory,
}