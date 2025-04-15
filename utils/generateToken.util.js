import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      channelName: user.channelName,
      email: user.email,
      phone: user.phone,
      logoId: user.logoId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
