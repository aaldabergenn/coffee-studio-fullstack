const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [itemSchema], required: true },
        totalPrice: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["pending", "paid", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
