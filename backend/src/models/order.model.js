const mongoose = require("mongoose");
const { ORDER_STATUS, DEFAULT_STATUS } = require("../constants/orderStatus");

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		fuelType: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		deliveryLocation: {
			type: String,
			required: true,
			trim: true,
			maxlength: 255,
		},
		preferredDeliveryTime: {
			type: Date,
		},
		status: {
			type: String,
			enum: ORDER_STATUS,
			default: DEFAULT_STATUS,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
