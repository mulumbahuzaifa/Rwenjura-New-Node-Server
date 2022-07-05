import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // orderItems: [
    //   {
    //     name: { type: String, required: true },
    //     qty: { type: Number, required: true },
    //     image: { type: String, required: true },
    //     price: { type: Number, required: true },
    //     product: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       required: true,
    //       ref: "Product",
    //     },
    //   },
    // ],
    userInfo: {
      name: { type: String, required: true },
      date: { type: Date, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      numberPersons: { type: String, required: true },
      country: { type: String, required: true },
      info: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
