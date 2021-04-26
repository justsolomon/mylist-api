const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const RefreshToken = require("../models/refreshTokenModel");
const Token = require("../models/tokenModel");
const User = require("../models/userModel");
const crypto = require("crypto");
const generateHashedPassword = require("../utils/generateHashedPassword");
const sendEmail = require("../utils/sendEmail");

/* helper functions */

const createAccessToken = (id) => {
  const token = jwt.sign({ id }, config.secret, {
    expiresIn: 86400, //24hrs
  });

  const expiresAt = jwt.verify(token, config.secret).exp;

  return { token, expiresAt };
};

//to check if a given field value already exists in db
const checkExisting = async (field, value) => {
  const existingUser = await User.findOne({ [field]: value });

  return existingUser ? true : false;
};

const randomTokenString = () => {
  return crypto.randomBytes(32).toString("hex");
};

//create new refresh token
const generateRefreshToken = (userId, ipAddress) => {
  const refreshToken = new RefreshToken({
    user: userId,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  });

  return refreshToken;
};

const getRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate("user");
  if (!refreshToken || !refreshToken.isActive)
    return { error: "Invalid token" };

  return refreshToken;
};

const setTokenCookie = (res, token) => {
  // create httponly cookie with refresh token that expires in 7 days
  if (token) {
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: "None",
      secure: true,
    };
    res.cookie("refreshToken", token, cookieOptions);
  }
};

exports.registerUser = async (body, ipAddress, res) => {
  try {
    const {
      password,
      email,
      username,
      confirmPassword,
      firstName,
      lastName,
    } = body;

    //check if passwords match
    if (password !== confirmPassword)
      return { error: "Passwords do not match" };

    //check if email is already in use
    if (await checkExisting("email", email))
      return { error: "This email address has been taken" };

    //check if name is already in use
    if (await checkExisting("username", username))
      return { error: "This username has been taken" };

    let hashedPassword = "";
    if (password) hashedPassword = generateHashedPassword(password);
    else return { error: "Password cannot be empty" };

    const user = new User({
      ...body,
      password: hashedPassword,
      fullName: `${firstName} ${lastName}`,
      imageUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
      dateJoined: new Date().toISOString(),
    });

    const result = await user.save();
    const jwt = createAccessToken(result._id);

    const refreshToken = generateRefreshToken(result._id, ipAddress);
    await refreshToken.save();

    // set refresh token in cookie header
    setTokenCookie(res, refreshToken.token);

    const userData = await User.findById(result._id)
      .populate("boards")
      .select("-password")
      .lean();

    return { ...userData, jwt };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

exports.loginUser = async (body, ipAddress, res) => {
  try {
    const { email, password } = body;

    //check if email and password exist
    if (!email || !password)
      return {
        error: `${!email ? "Email " : ""}${!email && !password ? "and " : ""}${
          !password ? "Password " : ""
        }cannot be empty`,
      };

    const user = await User.findOne({ email })
      .populate("boards")
      .select("-__v")
      .lean();
    if (!user) return { error: "User not found" };

    //return error if passwords don't match
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return { error: "Invalid password" };

    delete user.password;

    const jwt = createAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id, ipAddress);
    await refreshToken.save();

    // set refresh token in cookie header
    setTokenCookie(res, refreshToken.token);

    return { ...user, jwt };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

exports.refreshTokenController = async (token, ipAddress, res) => {
  try {
    const refreshToken = await getRefreshToken(token);

    //exit function if error exists
    if (refreshToken.error) return refreshToken;

    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user._id, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwt = createAccessToken(user._id);

    // set refresh token in cookie header
    setTokenCookie(res, newRefreshToken.token);

    return { jwt };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

exports.requestResetPassword = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) return { error: "This user does not exist" };

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = randomTokenString();
    const hash = generateHashedPassword(resetToken);

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `http://localhost:3000/reset-password?token=${resetToken}&userId=${user._id}`;
    const result = await sendEmail(
      user.email,
      "Reset your password",
      { name: user.firstName, link },
      "/views/resetPassword.handlebars"
    );

    return result;
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

exports.resetPassword = async (body) => {
  try {
    const { token, password, userId, confirmPassword } = body;

    //check if token and userId are in request
    if (!token && !userId)
      return { error: "Password reset token/User ID not provided" };

    if (!userId.match(/^[0-9a-fA-F]{24}$/))
      return { error: "User ID is not valid" };

    //check if passwords match
    if (password !== confirmPassword)
      return { error: "Passwords do not match" };

    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken)
      return { error: "Password reset token does not exist" };

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) return { error: "Invalid password reset token" };

    let hashedPassword = "";
    if (password) hashedPassword = generateHashedPassword(password);
    else return { error: "Password cannot be empty" };

    const user = await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    if (user) return { success: "Password reset successful" };
    else return { data: user, error: "Something went wrong" };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};
