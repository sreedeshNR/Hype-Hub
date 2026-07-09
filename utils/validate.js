const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

module.exports = {
  validateRegister,
  validateLogin,
  validateEditProfile,
  validateAddress,
  validateChangePassword,
  validateResetPassword,
};