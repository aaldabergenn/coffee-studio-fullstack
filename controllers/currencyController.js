const axios = require("axios");

exports.convert = async (req, res, next) => {
    try {
        const { from = "USD", to = "KZT", amount = "1" } = req.query;

        const value = Number(amount);
        if (Number.isNaN(value) || value <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        const base = process.env.EXCHANGE_API_BASE;
        const key = process.env.EXCHANGE_API_KEY;

        if (!base || !key) {
            return res.status(500).json({ message: "Currency API is not configured" });
        }

        const url = `${base}/${key}/pair/${from}/${to}/${value}`;
        const { data } = await axios.get(url);

        if (!data || data.result !== "success") {
            return res.status(502).json({ message: "Currency API error" });
        }

        return res.json({
            from,
            to,
            amount: value,
            rate: data.conversion_rate,
            result: data.conversion_result
        });

    } catch (err) {
        next(err);
    }
};
