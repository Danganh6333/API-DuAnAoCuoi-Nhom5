var { userModel } = require("../models/nguoiDung_models");
var bcrypt = require("bcrypt");
const COMMON = require("../COMMON");
console.log("API Router loaded");
const db = require("../models/db");

exports.checkExistedUser = async(req,res,next)=>{
  await db.mongoose.connect(COMMON.uri);
  try {
    const { email } = req.params;
    const userIsExisted = await userModel.findOne({ email });
    if (userIsExisted) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking email existence:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


exports.doLogin = async (req, res, next) => {
  await db.mongoose.connect(COMMON.uri);
  try {
    const user = await userModel.findByCredentials(
      req.body.username,
      req.body.password
    );
    if (!user) {
      return res.status(401).json({ error: "Sai thông tin đăng nhập" });
    }
    // đăng nhập thành công, tạo token làm việc mới
    const token = await user.generateAuthToken();
    return res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 400,
      messenger: "Internal Server Error",
    });
  }
};
exports.doReg = async (req, res, next) => {
  await db.mongoose.connect(COMMON.uri);
  try {
    const salt = await bcrypt.genSalt(10);

    const user = new userModel(req.body);

    user.password = await bcrypt.hash(req.body.password, salt);
    const token = await user.generateAuthToken();

    let new_u = await user.save();
    

    return res.status(201).send({ user: new_u, token });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

