import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const bookingSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    travellers: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    date: { type: Date, required: true },
    message: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const imageSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const daysSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    startingTime: { type: String, required: true },
    endTime: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    departure: {
      type: Date,
      required: true,
    },

    reviews: [reviewSchema],
    bookings: [bookingSchema],
    days: [daysSchema],
    images: [imageSchema],
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    travellers: {
      type: Number,
      required: false,
      default: 0,
    },
    numDays: {
      type: Number,
      required: false,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: false,
      default: 0,
    },
    numBookings: {
      type: Number,
      required: false,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    price_less: {
      type: Number,
      required: false,
      default: 0,
    },
    more_desc: {
      type: String,
      required: false,
    },
    cloudinary_id: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      required: true,
      default: false,
    },

    isPopular: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
