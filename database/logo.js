const logoModel = require("../model/logo.js");

module.exports.upload = async (req, res) => {
    try {
        const buffer = req.file.buffer;
        const id = req.body.id;
        const response = await logoModel.findOneAndUpdate({ id }, { $set: { id, logo: buffer } }, { upsert: true, new: true });
        res.send(response);
    } catch (err) {
        res.send(false);
    }
};

module.exports.get = async (req, res) => {
    try {
        const id = req.body.id;
        const response = await logoModel.findOne({ id });
        res.send(response);
    } catch (err) {
        res.send(false);
    }
};
