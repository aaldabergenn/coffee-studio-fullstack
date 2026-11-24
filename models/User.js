const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});
module.exports = mongoose.model("User", userSchema);
