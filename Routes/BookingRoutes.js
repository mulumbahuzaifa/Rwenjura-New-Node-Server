import express from "express";
import asyncHandler from "express-async-handler";
import Booking from "../Models/Booking";
import Product from "./../Models/ProductModel.js";

const bookingRoute = express.Router();

// BOOK FOR PRODUCT
bookingRoute.post(
  "/",

  asyncHandler(async (req, res) => {
    const { fullName, email, phone, travellers, country, date, message } =
      req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already Reviewed");
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Reviewed Added" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);
