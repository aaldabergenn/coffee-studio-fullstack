const User = require("../models/User");

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (name && (name.length < 2 || name.length > 50)) {
            return res.status(400).json({ message: "Name must be 2-50 characters" });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;

        await user.save();

        res.json({
            message: "Profile updated",
            user,
        });
    } catch (err) {
        next(err);
    }
};
