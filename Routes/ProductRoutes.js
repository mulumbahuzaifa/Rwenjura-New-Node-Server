import express from "express";
import asyncHandler from "express-async-handler";
import Product from "./../Models/ProductModel.js";
import { admin, protect } from "./../Middleware/AuthMiddleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const productRoute = express.Router();

// GET ALL PRODUCTS
productRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: -1 });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PEGINATION
productRoute.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  })
);

// GET SINGLE PRODUCT
productRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// PRODUCT REVIEW
productRoute.post(
  "/:id/review",
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
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
// PRODUCT DAYS
productRoute.post(
  "/:id/days",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, startingTime, endTime, description, tags } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const day = {
        name,
        startingTime,
        endTime,
        description,
        tags,
      };

      product.days.push(day);
      product.numDays = product.days.length;

      await product.save();
      res.status(201).json({ message: "Day Added" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);
// PRODUCT IMAGES
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use("/images", express.static(path.join(__dirname, "/images")));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({
  storage: multer.diskStorage({}),
  // fileFilter: (req, file, cb) => {
  //   let ext = path.extname(file.originalname);
  //   if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
  //     cb(new Error("File type not supported"), false);
  //     return;
  //   }
  //   cb(null, true);
  // },
});
productRoute.post(
  "/:id/images",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const { image } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);
        product.images.push(result.secure_url);
        await product.save();
        res.status(200).json("File has been uploaded");
      } catch (error) {
        console.error(error);
      }
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// PRODUCT BOOKING
productRoute.post(
  "/:id/booking",
  // protect,
  asyncHandler(async (req, res) => {
    const { fullName, email, phone, travellers, country, date, message } =
      req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const booking = {
        fullName,
        email,
        phone,
        travellers: Number(travellers),
        country,
        date,
        message,
        // user: req.user._id,
      };

      product.bookings.push(booking);
      product.numBookings = product.bookings.length;
      product.travellers =
        product.bookings.reduce((acc, item) => item.travellers + acc, 0) /
        product.bookings.length;

      await product.save();
      res.status(201).json({ message: "Package Booked" });
    } else {
      res.status(404);
      throw new Error("Package not Found");
    }
  })
);

// DELETE PRODUCT
productRoute.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// CREATE PRODUCT
productRoute.post(
  "/",
  protect,
  admin,

  asyncHandler(async (req, res) => {
    try {
      // const result = await cloudinary.uploader.upload(req.file.path);
      const {
        name,
        price,
        image,
        description,
        tag,
        departure,
        country,
        more_desc,
        cloudinary_id,
        isFeatured,
        isPopular,
      } = req.body;
      const productExist = await Product.findOne({ name });
      // console.log(result);
      if (productExist) {
        res.status(400);
        console.log("Product name already exist");
        throw new Error("Product name already exist");
      } else {
        const product = new Product({
          name,
          price,
          description,
          image,
          tag,
          departure,
          country,
          cloudinary_id,
          more_desc,
          isFeatured,
          isPopular,
          // user: req.user._id,
        });
        if (product) {
          const createdproduct = await product.save();
          res.status(201).json(createdproduct);
        } else {
          res.status(400);
          throw new Error("Invalid product data");
        }
      }
    } catch (error) {
      console.log(error);
    }
  })
);

// UPDATE PRODUCT
productRoute.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);
export default productRoute;
