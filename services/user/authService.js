const User = require("../../models/User")
const Otp = require("../../models/Otp")
const bcrypt = require("bcryptjs")
const sendOTPEmail = require("../../utils/sendEmail")


const generateOTP = ()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();

}

const registerUser = async({ fullName, username, email, phone, password})=>{
    const existingUser = await User.findOne({ email });

    if(existingUser && existingUser.isVerified){
        throw { status :409, field: "email", message: "Email already registered"};
    }

    const existingUsername = await User.findOne({ username, isVerified: true })

    if(existingUsername){
        throw { status : 409, field: "username", message: "Username already taken."}
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if(existingUser && !existingUser.isVerified){
        await User.findOneAndUpdate(
            { email },
            { fullName, username,phone, password: hashedPassword}
        )
    }else{
        await User.create({
            fullName, username, email, phone,
            password: hashedPassword,
            isVerified: false,
        });
    }

    return email;
}


const sendOtp = async (email)=>{
    const otp = generateOTP();
    await Otp.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 60 * 1000),
    });

    await sendOTPEmail(email, otp)
};



const verifyOtp = async  (email, otp)=>{
    const otpRecord = await Otp.findOne({ email, isUsed : false}).sort({ createdAt: -1})

    if(!otpRecord){
        throw { status: 400, message: "OTP not found. Please register again."};
    }

    if(otpRecord.expiresAt < new Date()){
        throw { status: 400, message: "OTP has expired.", isExpired: true}
    }

    if(otpRecord.otp !== otp){
        throw { status: 400, message: "Invaild OTP. Please try again."}
    }

    otpRecord.isUsed = true;
    await otpRecord.save()

    const user = await User.findOneAndUpdate(
        { email }, 
        { isVerified : true},
        { new: true}
    )

    return user;
}

const loginUser = async (email, password) =>{
    const user = await User.findOne({ email });

    if(!user){
        throw { status: 404, field: "email", message: "No account found with this email."}
    }

    if(user.isBlocked){
        throw { status: 403, field: "general", message: "Your account has been blocked. Contact support."}
    }

    if(!user.isVerified){
        throw{ status: 403, field: "unverified",message: "unverified"}
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw { status: 401, field: "password", message: "Incorrect password"}
    }

    return user;
}

const forgotPassword = async(email)=>{
    const user = await User.findOne({ email });
    if(!user){
        throw{ status: 404, message: "No account found with this email."};
    }
    
    const otp = generateOTP();
    await Otp.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 60 * 1000),
    });

    await sendOTPEmail(email,otp);
}


const verifyResetOtp = async(email,otp)=>{
    const otpRecord = await Otp.findOne({email, isUsed: false})
    .sort({ createdAt: -1})

    if(!otpRecord){
        throw{ status:400, message: "OTP not found. Please try again.", isExpired: false}
    }

    if(otpRecord.expiresAt < new Date()){
        throw{ status: 400, message: "OTP has expired.Please resend OTP.",isExpired: true};
    }

  if (otpRecord.otp !== otp) {
    throw { status: 400, message: "Invalid OTP. Please try again.", isExpired: false };
  }

  otpRecord.isUsed = true;
  await otpRecord.save();
};

const resetPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });
};


module.exports = {
  registerUser,
  sendOtp,
  verifyOtp,
  loginUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};