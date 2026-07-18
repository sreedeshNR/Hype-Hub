const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const productNameRegex = /^[A-Za-z0-9\s\-()'.]{3,100}$/;

const validateRegister = (data) => {
  const errors = {};

  if (!data.fullName || data.fullName.trim() === "") {
    errors.fullName = "Full name is required.";
  } else if (!/^[a-zA-Z\s]{3,50}$/.test(data.fullName.trim())) {
    errors.fullName = "Name must be 3-50 letters only.";
  }

  if (!data.username || data.username.trim() === "") {
    errors.username = "Username is required.";
  } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(data.username.trim())) {
    errors.username = "Username must be 3-20 chars, letters/numbers/underscore only.";
  }

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required.";
  } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.phone || data.phone.trim() === "") {
    errors.phone = "Phone number is required.";
  } else if (!/^[6-9]\d{9}$/.test(data.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  if (!data.password || data.password === "") {
    errors.password = "Password is required.";
  } else if (!strongPassword.test(data.password)) {
    errors.password = "Password must be 8+ chars with uppercase, lowercase, number and special character (@$!%*?&).";
  }

  if (!data.confirmPassword || data.confirmPassword === "") {
    errors.confirmPassword = "Confirm password is required.";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required.";
  } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password || data.password === "") {
    errors.password = "Password is required.";
  }

  return errors;
};

const validateEditProfile = (data) => {
  const errors = {};

  if (!data.fullName || data.fullName.trim() === "") {
    errors.fullName = "Full name is required.";
  } else if (!/^[a-zA-Z\s]{3,50}$/.test(data.fullName.trim())) {
    errors.fullName = "Name must be 3-50 letters only.";
  }

  if (!data.username || data.username.trim() === "") {
    errors.username = "Username is required.";
  } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(data.username.trim())) {
    errors.username = "Username must be 3-20 chars, letters/numbers/underscore only.";
  }

  if (data.phone && data.phone.trim() !== "") {
    if (!/^[6-9]\d{9}$/.test(data.phone.trim())) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }
  }

  return errors;
};

const validateAddress = (data)=>{
  const errors = {};

  if(!data.fullName || data.fullName.trim() === ""){
    errors.fullName = "Full Name is required."

  }else if(!/^[a-zA-Z\s]{3,50}$/.test(data.fullName.trim())){
    errors.fullName = "Name must be 3-50 letters only."
  }

  if(!data.phone || data.phone.trim() === ""){
    errors.phone = "Phone number is required."
  }else if(!/^[6-9]\d{9}$/.test(data.phone.trim())){
    errors.phone = "Enter a vaild 10-digit mobile number."
  }

  if(!data.addressLine || data.addressLine.trim() === ""){
    errors.addressLine = "Address line is required."
  }else if(data.addressLine.trim().length < 10){
    errors.addressLine = "Address must be at least 10 characters."
  }

  if(!data.city || data.city.trim() === ""){
    errors.city = "City is required."
  }else if(!/^[a-zA-Z\s]{2,50}$/.test(data.city.trim())){
    errors.city = "Enter a vaild city name."
  }

  if(!data.state || data.state.trim() === ""){
    errors.state = "State is required."
  }else if(!/^[a-zA-Z\s]{2,50}$/.test(data.state.trim())){
    errors.state = "Enter a vaild state name."
  }

  if(!data.pincode || data.pincode.trim() === ""){
    errors.pincode = "Pincode is required.";
  }else if(!/^[1-9][0-9]{5}$/.test(data.pincode.toString().trim())){
    errors.pincode = "Enter a vaild 6-digit pincode"
  }

  return errors
}

const validateChangePassword = (data) => {
  const errors = {};

  if (!data.currentPassword || data.currentPassword === "") {
    errors.currentPassword = "Current password is required.";
  }

  if (!data.newPassword || data.newPassword === "") {
    errors.newPassword = "New password is required.";
  } else if (!strongPassword.test(data.newPassword)) {
    errors.newPassword = "Password must be 8+ chars with uppercase, lowercase, number and special character.";
  }

  if (!data.confirmPassword || data.confirmPassword === "") {
    errors.confirmPassword = "Confirm password is required.";
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

const validateResetPassword = (data) => {
  const errors = {};

  if (!data.newPassword || data.newPassword === "") {
    errors.newPassword = "Password is required.";
  } else if (!strongPassword.test(data.newPassword)) {
    errors.newPassword = "Password must be 8+ chars with uppercase, lowercase, number and special character.";
  }

  if (!data.confirmPassword || data.confirmPassword === "") {
    errors.confirmPassword = "Confirm password is required.";
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

const validateCategory = (data)=>{
  const errors = {};

  if(!data.name || data.name.trim() === ""){
    errors.name = "Category name is required.";
  }else if(!/^[A-Za-z\s]{3,50}$/.test(data.name.trim())){
    errors.name = "Category name must be 3-50 characters and contain only letters and space.";
  }


  if(data.description && data.description.trim().length > 200){
    errors.description = "Description cannot exceed 200 characters."
  }

  return errors;
}


const validateBrand = (data)=>{

  const errors = {};

  if(!data.name || data.name.trim() === ""){
    errors.name = "Brand name is required.";
  }else if(!/^[A-Za-z0-9\s\-&']{2,50}$/.test(data.name.trim())){
    errors.name = "Brand name must be 2-50 characters and contain only valid characters.";
  }

  if(data.description && data.description.trim().length > 200){
    errors.description = "Description cannot exceed 200 characters.";
  }

  return errors;
}


const validateProduct = (data)=>{
  const errors = {}
  const productNameRegex = /^[A-Za-z0-9\s\-()'.]{3,100}$/;  

  if(!data.productName || data.productName.trim() === ""){
    errors.productName = "Product name is required."
  }else if(!productNameRegex.test(data.productName.trim())){
    errors.productName = "Product name can only contains letters, numbers, spaces, hyphens, apostrophes,and parentheses."
  }

  if(!data.categoryId || data.categoryId.trim() === ""){
    errors.categoryId = "Category is required.";
  }

  if(!data.brandId || data.brandId.trim() === ""){
    errors.brandId = "Brand is required."
  }

  if(!data.gender || data.gender.trim() === ""){
    errors.gender = "Gender is required."
  }else if(!["MEN", "WOMEN", "UNISEX"].includes(data.gender.toUpperCase())){
    errors.gender = "Invaild gender selected."
  }

  if(!data.description || data.description.trim() === ""){
    errors.description = "Description is required."
  }else if(data.description.trim().length > 500){
    errors.description = "Description cannot exceed 500 characters."
  }

  return errors;
}


const validateVariant = (data) =>{
  const errors = {}

  if(!data.color || data.color.trim() === ""){
    errors.color = "Color is required."
  }

  if(data.regularPrice === undefined || data.regularPrice === "" || Number(data.regularPrice) <= 0){
      errors.regularPrice = "Regular price must be greater than 0."
  }

  if(data.salePrice === undefined || data.salePrice === "" || Number(data.salePrice) <= 0){
    errors.salePrice = "Sale price must be greater than 0"
  }

  if(Number(data.salePrice) > Number(data.regularPrice)){
    errors.salePrice = "Sale price cannot be greater than regular price."
  }

  if(!Array.isArray(data.sizes) || data.sizes.length === 0){
    errors.sizes = "Add at least one sizes."
  }else {
    const invalidSize = data.sizes.some(s =>
      s.size === "" || isNaN(s.size) || s.quantity === "" || isNaN(s.quantity) || Number(s.quantity) < 0
    )

    if(invalidSize){
      errors.size = "All sizes must have valid numbers and positive quantities.";
    }
  }

  if(!data.images || !Array.isArray(data.images) || data.images.length < 3){
    errors.images = "You must upload a minimum of 3 images."
  }

  return errors;
}

module.exports = {
  validateRegister,
  validateLogin,
  validateEditProfile,
  validateAddress,
  validateChangePassword,
  validateResetPassword,
  validateCategory,
  validateBrand,
  validateProduct,
  validateVariant,
};