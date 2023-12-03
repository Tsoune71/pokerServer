const userModel = require("../model/user.js");
const friendModel = require("../model/friend.js");

module.exports.disconnected = async (socket) => {
    try {
        const upadte = await userModel.findOneAndUpdate({socket}, { $set: { connected: false } })
        return upadte._id
    } catch (err) {
        console.log(err);
    }
};

module.exports.getFriendConnected = async (id) => {
    try {
        let f = []
        const friends = await friendModel.find({ $or: [{ second: id }, { first: id }] });
        for (const friend of friends) {
            const { first, second } = friend;
            let other = first;
            if (first === id.toString()) other = second;
            const req = await userModel.findOne({_id:other,connected:true}, { _id:0, socket: 1 })
            if (req) f.push(req.socket)
        }
        return f
    } catch (err) {
        console.log(err);
    }
};