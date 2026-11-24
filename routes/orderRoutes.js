const router = require("express").Router();
const auth = require("../middleware/auth");
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} = require("../controllers/orderController");

router.post("/", auth, createOrder);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.put("/:id", auth, updateOrder);
router.delete("/:id", auth, deleteOrder);

module.exports = router;
