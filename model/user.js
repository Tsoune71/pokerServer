const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs')
const schemaUser = new Schema(
    {
        pseudo: {
            type: String,
            required:true,
            maxLength:10,
            minLength: 3,
            unique:true,
        },
        message:{
            type:Array
        },
        email:{
            type:String,
            required:true,
            minLength: 5,
            unique: true,
        },
        password: {
            type:String,
            required:true,
            minLength:6
        },
        money:{
            type:Number
        },
        socket:{
            type:String
        },
        connected:{
            type:Boolean,
            required:true,
        }
    },
    {
        timestamps: false,
    }
);

schemaUser.pre("save",async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next()
})

schemaUser.statics.login = async function (email,password) {
    const user = await this.findOne({ email },{password:true});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
}
const mod =  model("user",schemaUser)

module.exports = mod
