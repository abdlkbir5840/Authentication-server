const {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
} = require("../services/auth.service");

const register = async (req, res, next) => {
  console.log('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
  console.log(req.body)
  try {
    const { accessToken, refreshToken, name, email } = await registerUser(
      req.body
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", // allow sub domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, name, email });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, name, email } = await loginUser(
      req.body
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", // allow sub domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, name, email });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const accessToken = await refreshUser(cookie);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    await logoutUser(cookie);
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.json({ message: "Logout success" });
  } catch (err) {
    next(err);
  }
};
module.exports = { register, login, refresh, logout };
