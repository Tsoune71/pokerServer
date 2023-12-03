const userModel = require("../model/user.js");
const friendModel = require("../model/friend.js");
const logoModel = require("../model/logo.js");

module.exports.search = async (req, res) => {
    const { data } = req.body;
    const l2 = data.toLowerCase();
    try {
        let response = [];
        const users = await userModel.find({}, { _id: true, pseudo: true });
        for (const user of users) {
            const { pseudo, _id } = user;
            l1 = pseudo.toLowerCase();
            if (l1.includes(l2) && l1 !== l2) response.push([pseudo, _id.toString()]);
        }
        res.send(response);
    } catch (err) {
        res.send([]);
    }
};

module.exports.delete = async (req, res) => {
    const { first, second } = req.body;
    try {
        await friendModel.deleteOne({
            $or: [
                { first, second },
                { first: second, second: first },
            ],
        });
        const socket = await userModel.findById(second,{_id:0,socket:1})
        res.send(socket.socket);
    } catch (err) {
        res.send(true);
    }
};

module.exports.add = async (req, res) => {
    const { sender, receiver,pseudo } = req.body;
    try {
        const rec = await userModel.findByIdAndUpdate(receiver, { $push: { message: { id: sender, reason: "add",pseudo } } });
        if (rec.connected) res.send(rec.socket);
        else res.send(false);
    } catch (err) {
        res.send(false);
    }
};

module.exports.accept = async (req, res) => {
    const { sender, receiver } = req.body;
    try {
        await friendModel.create({ first: sender, second: receiver });
        const messages = await userModel.findById(sender, { _id: false, message: true });
        let n = [];
        for (const message of messages.message) {
            if (message.id !== receiver) n.push(message);
        }
        await userModel.findByIdAndUpdate(sender, { $set: { message: n } });
        res.send(true);
    } catch (err) {
        res.send(false);
    }
};

module.exports.get = async (req, res) => {
    const { id } = req.body;
    try {
        console.log(id);
        const friends = await friendModel.find({ $or: [{ second: id }, { first: id }] });
        let response = [];
        for (const friend of friends) {
            const { first, second } = friend;
            let other = first;
            if (first === id) other = second;
            const user = await userModel.findById(other, { money: 1, pseudo: 1, socket: 1, connected: 1 });
            const buffer = await logoModel.findOne({ id: other }, { logo: 1, _id: 0 });
            if (buffer) {
                response.push({ id: other, logo: buffer.logo, pseudo: user.pseudo, socket: user.socket, money: user.money, connected: user.connected });
            } else {
                response.push({ id: other, logo: undefined, pseudo: user.pseudo, socket: user.socket, money: user.money, connected: user.connected });
            }
        }
        res.send(response);
    } catch (err) {
        console.log(err);
        res.send(false);
    }
};
