const { Schema, model } = require("mongoose");
const schemaUser = new Schema(
    {
        id:{
            type:String,
            unique:true,
            required:true,
        },
        players:{
            type:Array,
        },
        cards:{
            type:Array
        }
    },
    {
        timestamps: false,
    }
);

const mod = model("game", schemaUser);

module.exports = mod;
