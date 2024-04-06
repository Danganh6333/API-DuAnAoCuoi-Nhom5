const { HoaDonModel } = require("../models/hoaDon_model");
const { DichVuModel } = require("../models/dichVu_model");
const COMMON = require("../COMMON");
const mongoose = require("mongoose");
exports.getListHoaDon = async (req, res, next) => {
  try {
    await mongoose.connect(COMMON.uri);
    const HoaDons = await HoaDonModel.find()
      .populate("idNhanVien")
      .populate("idKhachHang")
      .populate("idDichVus");
    console.log(HoaDons);
    res.send(HoaDons);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      messenger: "Lỗi Server",
      data: [],
    });
  }
};
exports.addHoaDon = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { idNhanVien, idKhachHang, idDichVus, ngayTao, tongTien } = req.body;
    if (!Array.isArray(idDichVus)) {
      return res.status(400).json({
        status: 400,
        messenger: "Lỗi, idDichVus phải là một mảng",
        data: [],
      });
    }

    const newHoaDon = new HoaDonModel({
      idNhanVien,
      idKhachHang,
      idDichVus,
      ngayTao,
      tongTien,
    });
    const result = await newHoaDon.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm thành công",
        data: result,
      });
    } else {
      res.status(400).json({
        status: 400,
        messenger: "Lỗi, thêm không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      messenger: "Internal Server Error",
      data: [],
    });
  }
};

exports.updateHoaDon = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { id } = req.params;
    const data = req.body;
    const updateHoaDon = await HoaDonModel.findById(id);

    let result = null;
    if (updateHoaDon) {
      updateHoaDon.tenHoaDon = data.tenHoaDon ?? updateHoaDon.tenHoaDon;
      updateHoaDon.idKhachHang = data.idKhachHang ?? updateHoaDon.idKhachHang;
      updateHoaDon.tongTien = data.tongTien ?? updateHoaDon.tongTien;
      result = await updateHoaDon.save();
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
exports.deleteHoaDon = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { id } = req.params;
    const result = await HoaDonModel.findByIdAndDelete(id);
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
exports.searchHoaDonTheoId = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { id } = req.params;
    const data = await HoaDonModel.findById(id)
      .populate("idNhanVien")
      .populate("idKhachHang").populate({
        path: "idDichVus",
        populate: { path: "idDichVu" }
      });;
    res.json({
      status: 200,
      messenger: "Thông tin hóa đơn",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};
