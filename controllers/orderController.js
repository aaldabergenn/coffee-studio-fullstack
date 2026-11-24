const Order = require("../models/Order");

function validateItems(items) {
  return Array.isArray(items) && items.length > 0 && items.length <= 50 && items.every(item =>
    typeof item.productName === "string" && item.productName.trim() && item.productName.length <= 120 &&
    Number.isFinite(item.price) && item.price >= 0 &&
    Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99
  );
}

exports.createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!validateItems(items)) return res.status(400).json({ message: "Invalid order items" });
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ user: req.user.id, items, totalPrice });
    res.status(201).json(order);
  } catch (err) { next(err); }
};
exports.getMyOrders = async (req, res, next) => {
  try { res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 })); }
  catch (err) { next(err); }
};
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { next(err); }
};
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (req.body.items !== undefined) {
      if (!validateItems(req.body.items)) return res.status(400).json({ message: "Invalid items" });
      order.items = req.body.items;
      order.totalPrice = req.body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    if (req.body.status !== undefined) {
      if (!["pending", "paid", "cancelled"].includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });

      order.status = req.body.status;
    }
    await order.save(); res.json(order);
  } catch (err) { next(err); }
};
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) { next(err); }
};
