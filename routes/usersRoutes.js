import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  depositToUser,
  updateCredit,
  withdrawMoney,
  transfer,
  filterUsersByCashAmount,
} from "../controllers/userController.js";

const router = express.Router();

//Route to get all users
router.get("/users", getAllUsers);

//Route to get single user by ID
router.get("/:id", getUserById);

//Route to create a new account
router.post("/create", createUser);

router.put("/:userId/deposit", depositToUser);

// //Route to make a withdrawal

router.put("/:userId/withdraw", withdrawMoney);

//Route to update credit to an existing user

router.put("/:userId/update-credit", updateCredit);

// //Route to make a transfer money between users
// OLD router.put("/transfer/:fromId/:toId/amount", transfer);
router.put("/:fromId/:toId/transfer", transfer);

// //Route to  update filter to user

router.get("/:min/:max/filter", filterUsersByCashAmount);

export default router;
