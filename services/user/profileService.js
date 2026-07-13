const User = require("../../models/User")
const Otp = require("../../models/Otp")
const bcrypt = require("bcryptjs")
const sendOTPEmail = require("../../utils/sendEmail")

const generateOTP = ()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const getUserById = async(userId)=>{
    return await User.findById(userId);
}

const checkUsernameExists = async(username, userId) =>{
    return await User.findOne({ username, _id: { $ne: userId }});
}

const updateUserProfile = async(userId, updateData)=>{
    return await User.findByIdAndUpdate(userId, updateData,{ new:true});
}

const verifyCurrentPassword  = async(currentPassword, hashedPassword)=>{
    return await bcrypt.compare(currentPassword,hashedPassword)
}

const updatePassword = async(userId, newPassword)=>{
    const hashedPassword = await bcrypt.hash(newPassword,10);
    return await User.findByIdAndUpdate(userId, { password: hashedPassword})
}

const checkEmailExists = async(email)=>{
    return await User.findOne({ email });
}

const sendEmailOtp = async(email)=>{
    const otp = generateOTP();
    await Otp.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 60 * 1000),
    })
    await sendOTPEmail(email,otp);
}


const verifyEmailOtp = async(email,otp)=>{
    const otpRecord = await Otp.findOne({ email, isUsed: false})
    .sort({ createdAt: -1})


    if(!otpRecord){
        throw { status: 400, message:"OTP not found. Please try again",isExpired: false}
    }

    if(otpRecord.expiresAt < new Date()){
        throw{ status : 400, message: "OTP has expired. Please resend OTP.", isExpired : true};
    }

    if(otpRecord.otp !== otp){
        throw{ status: 400, message: "Invaild OTP. please try again.", isExpired: false}
    }

    otpRecord.isUsed = true
    await otpRecord.save();
}


const updateEmail = async(userId, newEmail)=>{
    return await User.findByIdAndUpdate(userId, { email: newEmail})
};

const resendEmailOtp = async(email)=>{
    const otp = generateOTP();
    await Otp.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 60 * 1000),
    })

    await sendOTPEmail(email,otp);
};

module.exports = {
  getUserById,
  checkUsernameExists,
  updateUserProfile,
  verifyCurrentPassword,
  updatePassword,
  checkEmailExists,
  sendEmailOtp,
  verifyEmailOtp,
  updateEmail,
  resendEmailOtp,
};