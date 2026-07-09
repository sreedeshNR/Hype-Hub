const User = require("../../models/User")
const bcrypt = require("bcryptjs")

const loginAdmin = async(email, password)=>{
    const admin = await User.findOne({ email, role: "ADMIN"})

    if(!admin){
        throw { status: 404, message: "Invalid Credentials."}
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if(!isMatch){
        throw { status: 401, message: "Incorrect password."}
    }

    return admin;
};

module.exports = { loginAdmin }