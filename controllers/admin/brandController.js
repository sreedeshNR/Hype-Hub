const brandService = require("../../services/admin/brandService");
const { validateBrand } = require("../../utils/validate"); // Fixed typo here

const getBrands = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || "";
        const page = Number(req.query.page) || 1;
        const limit = 5;

        const { brands, totalBrands, totalPages } = await brandService.getAllBrands({
            search,
            status,
            page,
            limit,
        });

        const success = req.session.adminSuccess || null;
        req.session.adminSuccess = null;

        res.status(200).render("admin/brands", {
            title: "Brand Management",
            admin: req.session.admin, // Fixed typo: was adminSuccess
            brands,
            search,
            status,
            currentPage: page,
            totalPages,
            totalBrands,
            limit,
            success,
            layout: false,
        });
    } catch (error) {
        next(error);
    }
};

const getAddBrand = (req, res) => {
    res.status(200).render("admin/add-brand", {
        title: "Add Brand",
        admin: req.session.admin,
        errors: {},
        formData: {},
        layout: false,
    });
};

const postAddBrand = async (req, res, next) => {
    try {
        const { name, slug, description, isActive } = req.body;

        if (req.uploadError) {
            return res.status(400).render("admin/add-brand", {
                title: "Add Brand",
                admin: req.session.admin,
                errors: { general: req.uploadError },
                formData: req.body,
                layout: false,
            });
        }

        const errors = validateBrand({ name, slug, description });

        if (!req.file) {
            errors.image = "Brand logo is required.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("admin/add-brand", {
                title: "Add Brand",
                admin: req.session.admin,
                errors,
                formData: req.body,
                layout: false,
            });
        }

        await brandService.addBrand({
            name,
            slug,
            description,
            image: req.file ? req.file.path : "",
            isActive: isActive === "true",
        });

        req.session.adminSuccess = "Brand added successfully.";
        res.redirect("/admin/brands");

    } catch (error) {
        // ✅ Added error.code === 11000 to catch MongoDB Duplicate Key crashes
        if (error.status === 409 || error.code === 11000) {
            return res.status(400).render("admin/add-brand", {
                title: "Add Brand",
                admin: req.session.admin,
                errors: { name: "A brand with this name or slug already exists." },
                formData: req.body,
                layout: false,
            });
        }

        next(error);
    }
};

const getEditBrand = async (req, res, next) => {
    try {
        const brand = await brandService.getBrandById(req.params.id);

        if (!brand) {
            return res.redirect("/admin/brands");
        }

        res.status(200).render("admin/edit-brand", {
            title: "Edit Brand",
            admin: req.session.admin,
            brand,
            errors: {},
            layout: false,
        });
    } catch (error) {
        next(error);
    }
};

const postEditBrand = async (req, res, next) => {
    try {
        const { name, slug, description, isActive } = req.body;

        if (req.uploadError) {
            const brand = await brandService.getBrandById(req.params.id);
            return res.status(400).render("admin/edit-brand", {
                title: "Edit Brand",
                admin: req.session.admin,
                brand,
                errors: { general: req.uploadError },
                layout: false,
            });
        }

        const errors = validateBrand({ name, description });

        if (Object.keys(errors).length > 0) {
            const brand = await brandService.getBrandById(req.params.id);

            brand.name = name;
            brand.description = description;
            brand.isActive = isActive === "true";

            return res.status(400).render("admin/edit-brand", {
                title: "Edit Brand",
                admin: req.session.admin,
                brand,
                errors,
                layout: false,
            });
        }

        await brandService.updateBrand(req.params.id, {
            name,
            slug,
            description,
            image: req.file ? req.file.path : null,
            isActive: isActive === "true"
        });

        req.session.adminSuccess = "Brand updated successfully.";
        res.redirect("/admin/brands");

    } catch (error) {
        // ✅ Added error.code === 11000 to catch MongoDB Duplicate Key crashes on edit
        if (error.status === 409 || error.code === 11000) {
            const brand = await brandService.getBrandById(req.params.id);
            brand.name = req.body.name;
            brand.description = req.body.description;
            brand.isActive = req.body.isActive === "true";

            return res.status(400).render("admin/edit-brand", {
                title: "Edit Brand",
                admin: req.session.admin,
                brand,
                errors: { name: "A brand with this name or slug already exists." },
                layout: false,
            });
        }

        next(error);
    }
};

const toggleBrandStatus = async (req, res, next) => {
    try {
        const brand = await brandService.toggleBrandStatus(req.params.id);

        req.session.adminSuccess = `Brand ${brand.name} has been ${brand.isActive ? "activated" : "deactivated"} successfully.`;

        res.redirect("/admin/brands");
    } catch (error) {
        next(error);
    }
};

const deleteBrand = async (req, res, next) => {
    try {
        const brand = await brandService.deleteBrand(req.params.id); // Fixed typo: was deletedBrand

        req.session.adminSuccess = `Brand ${brand.name} deleted successfully.`;
        res.redirect("/admin/brands");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBrands,
    getAddBrand,
    postAddBrand,
    getEditBrand,
    postEditBrand,
    toggleBrandStatus,
    deleteBrand,
};