import { generateHashedPassword, userModal } from "../modals/user.modal.js";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

async function generateAccessTokenAndRefreshToken(id) {
  const user = await userModal.findById(id);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return { accessToken, refreshToken };
}

async function userLogin(req, res) {
  try {
    const { email, picture } = req.body;
    let [user] = await userModal.find({ email });

    if (!user) {
      //const hashedPassword = await generateHashedPassword(password);
      user = await userModal.create({ email, picture });

      let { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);
      user.refreshToken = refreshToken;
      await user.save();

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ email, message: "User created successfully." });
    } else {
      let { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ email, message: "User logged in successfully." });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went worng while logging user." });
  }
}

async function userLogout(req, res) {
  try {
    let user = await userModal.findById(req.userId);
    user.refreshToken = "";
    await user.save();
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong during logging out" });
  }
}

async function userPageGotRefreshed(req, res) {
  let id = req.userId;
  let user = await userModal.findById(id);
  let { _id, email } = user;
  res
    .status(200)
    .json({ _id, email, message: "User deatils after page refreshed" });
}

export { userLogin, userLogout, userPageGotRefreshed };
