const addressService = require("../../services/user/addressService")
const { validateAddress } = require("../../utils/validate");

// GET /addresses
const getAddresses = async (req, res,next) => {
  try {
    const addresses = await addressService.getAllAddresses( req.session.user._id );
    const success = req.session.success || null;
    req.session.success = null;
    
    res.status(200).render("user/profile/addresses", {
      title: "Addresses",
      user: req.session.user,
      addresses,
      success,
    });
  } catch (error) {
    next(error)
  }
};

// GET /addresses/add
const getAddAddress = (req, res) => {
  res.status(200).render("user/profile/add-address", {
    title: "Add Address",
    user: req.session.user,
    errors: {},
    formData: {},
  });
};

// POST /addresses/add
const postAddAddress = async (req, res,next) => {
  try {
    const {
      fullName, phone, addressLine,
      landmark, city, state,
      pincode, addressType, isDefault,
    } = req.body;

    const errors = validateAddress({ fullName, phone, addressLine, city, state, pincode });
    if (Object.keys(errors).length > 0) {
      return res.status(400).render("user/profile/add-address", {
        title: "Add Address",
        user: req.session.user,
        errors,
        formData: req.body,
      });
    }

    await addressService.addAddress(req.session.user._id,{
      fullName,phone,addressLine,
      landmark, city, state, pincode,
      addressType, isDefault: isDefault ? true : false,
    })

    req.session.success = "Address added successfully!";
    res.redirect("/addresses")

  } catch (error) {
    next(error)
  }
};


// GET /addresses/edit/:id
const getEditAddress = async (req, res,next) => {
  try {
    const address = await addressService.getAddressById(
      req.params.id,
      req.session.user._id
    );

    if (!address) return res.redirect("/addresses");

    res.status(200).render("user/profile/edit-address", {
      title: "Edit Address",
      user: req.session.user,
      address,
      errors: {},
    });
  } catch (error) {
    next(error)

  }
};

// POST /addresses/edit/:id
const postEditAddress = async (req, res,next) => {
  try {
    const {
      fullName, phone, addressLine,
      landmark, city, state,
      pincode, addressType, isDefault,
    } = req.body;

    const errors = validateAddress({ fullName, phone, addressLine, city, state, pincode });
    if (Object.keys(errors).length > 0) {
      const address = await addressService.getAddressById(req.params.id, req.session.user._id);
      return res.status(400).render("user/profile/edit-address", {
        title: "Edit Address",
        user: req.session.user,
        address,
        errors,
      });
    }



    await addressService.updateAddress(req.params.id, req.session.user._id, {
      fullName, phone, addressLine,
      landmark, city, state,
      pincode, addressType,
      isDefault: isDefault ? true : false,
    });

    req.session.success = "Address Updated successfully!";

    res.redirect("/addresses");

  } catch (error) {
    next(error)

  }
};


// POST /addresses/delete/:id
const deleteAddress = async (req, res,next) => {
  try {
    await addressService.deleteAddress(
      req.params.id,
      req.session.user._id,
    )

    req.session.success = "Address deleted successfully"
    res.redirect("/addresses");
  } catch (error) {
    next(error)
  }
};

module.exports = {
  getAddresses,
  getAddAddress,
  postAddAddress,
  getEditAddress,
  postEditAddress,
  deleteAddress,
};