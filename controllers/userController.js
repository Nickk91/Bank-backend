import STATUS_CODE from "../constants/statusCodes.js";
import User from "../models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(STATUS_CODE.CREATED).send(user);
  } catch (error) {
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// @des get all users
// @route GET / api/n
// @access Public
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log("Error fetching users", error);
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne(req.params.userId);
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found");
    }

    res.send(user);
  } catch (error) {
    console.log("Error fetching user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// router.put("/:userId/update-credit", updateCredit);
export const updateCredit = async (req, res) => {
  try {
    const { userId } = req.params;
    if (+req.query.credit < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Please enter a positive number");
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { credit: +req.query.credit } },
      { new: true }
    );

    res.status(STATUS_CODE.OK).send(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// /:id/deposit"
// router.put("/:userId/deposit", depositToUser);
export const depositToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`userId`, userId);
    if (+req.query.deposit < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Please enter a positive number");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { cash: ++req.query.deposit } },
      { new: true }
    );

    res.status(STATUS_CODE.OK).send(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// router.put("/:userId/withdraw", withdrawMoney );
export const withdrawMoney = async (req, res) => {
  try {
    const { userId } = req.params;
    if (+req.query.withdraw < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Please enter a positive number");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,

      { $inc: { cash: -req.query.withdraw-- } },
      { new: true }
    );

    res.status(STATUS_CODE.OK).send(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const transfer = async (req, res) => {
  try {
    let amount = +req.query.transfer;

    const senderUser = await User.findById(req.params.fromId);
    const recipientUser = await User.findById(req.params.toId);
    const senderCash = senderUser.cash;
    const senderCredit = senderUser.credit;

    if (amount < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Please enter a positive number");
    }

    if (!senderUser || !recipientUser) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("Please check the users ids, one of them is wrong ");
    }

    if (senderUser._id.toString() === recipientUser._id.toString()) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("You can't transfer money to your own account");
    }

    if (senderCash < amount && senderCash > 0) {
      const diff = amount - senderCash;

      if (diff <= amount && senderCredit + diff >= amount) {
        senderUser.cash = 0;
        senderUser.credit -= diff;
      } else {
        res.status(STATUS_CODE.BAD_REQUEST);
        throw new Error("Insufficient funds for the transfer");
      }
    } else if (senderCash >= amount) {
      senderUser.cash -= amount;
    } else {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Insufficient funds for the transfer");
    }

    recipientUser.credit += amount;

    await senderUser.save();
    await recipientUser.save();

    res.status(200).json({
      sender: senderUser,
      recipient: recipientUser,
      message: `Transfer of ${amount} completed successfully`,
    });
  } catch (error) {
    console.error("Error transferring money:", error);
    res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// // @des update credit to user
// // @route PUT / api/:userId/update-credit
// // @access Public
export const updateCreditToUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { credit } = req.body;

    if (!userId || !credit || credit <= 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "Please provide a valid 'userId' and a positive 'credit' value"
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { credit: credit } },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error(`User with ID ${userId} not found`);
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
};

// // @des update filter to user
// // @route GET /:min/:max/filter
// // @access Public

export const filterUsersByCashAmount = async (req, res, next) => {
  try {
    const minCashAmount = +req.params.min;
    const maxCashAmount = +req.params.max;

    const usersWithinCashRange = await User.find({
      cash: { $gte: minCashAmount, $lte: maxCashAmount },
    });

    res.status(STATUS_CODE.OK).json(usersWithinCashRange);
  } catch (error) {
    console.error("Error fetching users by cash range:", error);
    res.status(STATUS_CODE.NOT_FOUND).json({ error: "Not Found" });
  }
};
