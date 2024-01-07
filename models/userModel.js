import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  fName: {
    type: String,
    required: true,
    minlength: 1,
  },
  lName: {
    type: String,
    required: true,
    minlength: 1,
  },

  cash: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        return value >= 0;
      },
      message: "Price must be a positive number",
    },
  },

  credit: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        return value >= 0;
      },
      message: "Credit must be a positive number",
    },
  },
});

// [
//   {
//     "id": "9b99471c-3b26-4f54-b1d6-9c80358cef2d",
//     "userId": "214060642",
//     "fName": "Elad",
//     "lName": "Harel",
//     "cash": 1300,
//     "credit": 800
//   },
//   {
//     "id": "e9e7f3ac-1044-436f-bb76-3bdff47ff991",
//     "userId": "214560542",
//     "fName": "Fady",
//     "lName": "Zarka",
//     "cash": 9000,
//     "credit": 0
//   },
//   {
//     "id": "6e8dbdaf-c9c4-4064-8a12-3d4a9bad42be",
//     "userId": "216568442",
//     "fName": "Nikolai",
//     "lName": "Kaploon",
//     "cash": 4000,
//     "credit": 2000
//   },
//   {
//     "id": "c4cd93fc-0e40-485b-a6fc-9d8a7f9e8f6b",
//     "userId": "316568442",
//     "fName": "Osayd",
//     "lName": "Ayoub",
//     "cash": 0,
//     "credit": 0
//   }
// ]

const User = mongoose.model("User", userScheme);
export default User;
