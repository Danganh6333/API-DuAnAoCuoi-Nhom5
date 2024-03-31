const { NhanVienModel } = require("../models/nhanVien_model");
const mongoose  = require('mongoose')
const db = require("../models/db");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();
const chuoi_ky_tu_bi_mat = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt");
const COMMON = require("../COMMON");


exports.checkExistedUser = async(req,res,next)=>{
  await db.mongoose.connect(COMMON.uri);
  try {
    const { email } = req.params;
    const userIsExisted = await NhanVienModel.findOne({ email }); 
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
    const nhanVien = await NhanVienModel.findByCredentials(
      req.body.email,
      req.body.matKhau
    ); // Use NhanVienModel
    if (!nhanVien) {
      return res.status(401).json({ error: "Sai thông tin đăng nhập" });
    }
    // Đăng nhập thành công, tạo token làm việc mới
    const token = await nhanVien.generateAuthToken(); // Use nhanVien object
    return res.status(200).send({ user: nhanVien, token }); // Use nhanVien object
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
    const nhanVien = new NhanVienModel(req.body); 

    nhanVien.matKhau = await bcrypt.hash(req.body.matKhau, salt); 
    const token = await nhanVien.generateAuthToken(); 

    const newNhanVien = await nhanVien.save();

    return res.status(201).send({ user: newNhanVien, token });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

exports.getListNhanVien = async (req, res, next) => {
  try {
    await mongoose.connect(COMMON.uri);
    const nhanviens = await NhanVienModel.find();
    console.log(nhanviens);
    res.send(nhanviens);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      messenger: "Lỗi Server",
      data: [],
    });
  }
};

exports.addNhanVien = async (req, res, next) => {
  await db.mongoose.connect(COMMON.uri);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.matKhau, salt); 
    const newNhanVien = new NhanVienModel({
      hoTen: req.body.hoTen,
      tenNguoiDung: req.body.tenNguoiDung,
      vaiTro: req.body.vaiTro,
      matKhau: hashedPassword,
      email: req.body.email,
      diaChi: req.body.diaChi,
      dienThoai: req.body.dienThoai,
      ghiChu: req.body.ghiChu,
    });
    const savedNhanVien = await newNhanVien.save();

    if (savedNhanVien) {
      const token = jwt.sign(
        { _id: savedNhanVien._id, username: savedNhanVien.email },
        chuoi_ky_tu_bi_mat
      );
      return res.status(201).json({ user: savedNhanVien, token });
    } else {
      return res.status(400).json({
        status: 400,
        messenger: "Lỗi, thêm không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      messenger: "Internal Server Error",
      data: [],
    });
  }
};

exports.deleteNhanVien = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { id } = req.params;
    const result = await NhanVienModel.findByIdAndDelete(id);
    if (result) {
      res.json({
        status: 200,
        messenger: "Xóa thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Lỗi,Xóa không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.updateNhanVien = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { id } = req.params;
    const data = req.body;
    const updateNhanVien = await NhanVienModel.findById(id);

    let result = null;
    if (updateNhanVien) {
      updateNhanVien.hoTen = data.hoTen ?? updateNhanVien.hoTen;
      updateNhanVien.tenNguoiDung =
        data.tenNguoiDung ?? updateNhanVien.tenNguoiDung;
      updateNhanVien.vaiTro =
        data.vaiTro ?? updateNhanVien.vaiTro;
      updateNhanVien.matKhau = data.matKhau ?? updateNhanVien.matKhau;
      updateNhanVien.email = data.email ?? updateNhanVien.email;
      updateNhanVien.diaChi = data.diaChi ?? updateNhanVien.diaChi;
      updateNhanVien.dienThoai = data.dienThoai ?? updateNhanVien.dienThoai;
      updateNhanVien.ghiChu = data.ghiChu ?? updateNhanVien.ghiChu;
      result = await updateNhanVien.save();
    }

    if (result) {
      res.json({
        status: 200,
        messenger: "Cập nhật thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Lỗi, cập nhật không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      messenger: "Internal Server Error",
      data: [],
    });
  }
  
};
