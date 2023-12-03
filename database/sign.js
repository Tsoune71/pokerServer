const userModel = require("../model/user.js");

module.exports.signUp = async (req, res) => {
    const { pseudo, email, password, socket } = req.body;
    try {
        const response = await userModel.create({ pseudo, email, password, money: 0, socket, connected: true });
        res.send(response);
    } catch (err) {
        res.send(false);
    }
};

module.exports.verifEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const response = await userModel.findOne({ email }, { _id: true, email: true });
        if (response.email) res.send(true);
        else res.send(false);
    } catch (err) {
        res.send(false);
    }
};
module.exports.signIn = async (req, res) => {
    const { email, password, socket } = req.body;
    try {
        const log = await userModel.login(email, password);
        await userModel.findByIdAndUpdate(log.id, { $set: { socket, connected: true } });
        res.send(await userModel.findById(log._id).select("-password"));
    } catch (err) {
        res.send(false);
    }
};
module.exports.user = async (req, res) => {
    const { id, socket } = req.body;
    try {
        if (socket) res.send(await userModel.findByIdAndUpdate(id, { $set: { socket, connected: true } }).select("-password"));
        else res.send(await userModel.findById(id).select("-password"));
    } catch (err) {
        res.send(false);
    }
};
