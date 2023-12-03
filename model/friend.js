const { Schema, model } = require("mongoose");
const schemaUser = new Schema(
    {
        first:{
            type:String,
            required:true,
        },
        second:{
            type:String,
            required:true,
        },
    },
    {
        timestamps: false,
    }
);

const mod = model("friend", schemaUser);

module.exports = mod;
