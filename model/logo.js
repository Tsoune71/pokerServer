const { Schema, model } = require("mongoose");
const schemaUser = new Schema(
    {
        id:{
            type:String,
            unique:true,
            required:true,
        },
        logo: {
            type:Buffer
        }
    },
    {
        timestamps: false,
    }
);

const mod = model("logo", schemaUser);

module.exports = mod;