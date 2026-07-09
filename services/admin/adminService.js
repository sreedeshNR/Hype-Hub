const User = require("../../models/User")

const getAllUsers = async({ search, page, limit})=>{
    const skip = (page - 1) * limit;

    const filter = {
        role: "USER",
        isVerified:true,
        ...(search && {
            $or: [
                {fullName: { $regex: search, $options:"i"}},
                {email: { $regex: search, $options:"i"}},
            ],
        }),
    };

    const totalUsers = await User.countDocuments(filter)
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await User.find(filter)
    .sort({ createdAt: -1})
    .skip(skip)
    .limit(limit)

    return { users, totalUsers, totalPages};
}

const blockUser = async(id)=>{
    const user = await User.findByIdAndUpdate(
        id,
        { isBlocked: true},
        { new: true}
    )

    return user;
};

const unblockUser = async(id)=>{
    const user = await User.findByIdAndUpdate(
        id,
        { isBlocked: false},
        { new: true}
    )

    return user;
};

module.exports = { getAllUsers, blockUser, unblockUser}