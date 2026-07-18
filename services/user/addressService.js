const Address = require("../../models/Address")

const getAllAddresses = async(userId)=>{
    return await Address.find({ userId });
}

const addAddress = async(userId, addressData)=>{
    if(addressData.isDefault){
        await Address.updateMany({ userId}, { isDefault: false})
    }

    return await Address.create({ userId, ...addressData})
}

const getAddressById = async(id, userId)=>{
    return await Address.findOne({ _id: id, userId})
};

const updateAddress = async(id, userId, addressData)=>{
    if(addressData.isDefault){
        await Address.updateMany({ userId }, { isDefault: false});
    }

    return await Address.findByIdAndUpdate(id, addressData,{ new:true});
};

const deleteAddress = async(id, userId)=>{
    return await Address.findOneAndDelete({ _id: id, userId})
};

module.exports = {
    getAllAddresses,
    addAddress,
    getAddressById,
    updateAddress,
    deleteAddress
}