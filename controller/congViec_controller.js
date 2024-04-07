const COMMON = require('../COMMON')
const { CongViecModel } = require("../models/congViec_model");
const mongoose = require("mongoose");
exports.getListCongViec = async (req, res, next) => {
  try {
    await mongoose.connect(COMMON.uri);
    const congViec = await CongViecModel.find().populate("idNhanVien");
    console.log(congViec);

    res.status(200).json(congViec);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách công việc" });
  }
};

exports.addCongViec = async (req, res, next) => {
  try {
    await mongoose.connect(COMMON.uri);

    const { idNhanVien, tenCongViec, ngayBatDau, ngayKetThuc, trangThai, noiDungCongViec } =
      req.body;

    const newCongViec = new CongViecModel({
      idNhanVien,
      tenCongViec,
      ngayBatDau,
      ngayKetThuc,
      trangThai,
      noiDungCongViec,
    });

    const savedCongViec = await newCongViec.save();

    res.status(200).json(savedCongViec);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi thêm công việc" });
  }
};

exports.updateCongViec = async (req, res, next) => {
  try {
    await mongoose.connect(COMMON.uri);

    const idCongViec = req.params.id;
    const { idNhanVien, tenCongViec, ngayBatDau, ngayKetThuc, trangThai, noiDungCongViec } =
      req.body;

    const updatedCongViec = await CongViecModel.findByIdAndUpdate(
      idCongViec,
      { idNhanVien, tenCongViec, ngayBatDau, ngayKetThuc, trangThai, noiDungCongViec },
      { new: true }
    );

    res.status(200).json(updatedCongViec);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi cập nhật thông tin công việc" });
  }
};

exports.deleteCongViec = async (req, res, next) => {
  try {
    await mongoose.connect(COMMON.uri);

    const congViecId = req.params.id;

    await CongViecModel.findByIdAndDelete(congViecId);

    res.status(200).json({ message: "Xóa công việc thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi xóa công việc" });
  }
};

exports.searchCongViecTheoId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await CongViecModel.findById(id).populate('idNhanVien');
    res.json({
      status: 200,
      messenger: "Thông tin hóa đơn",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getListCongViecTheoNhanVien = async (req, res, next) => {
  try {
    await mongoose.connect(COMMON.uri);
    const { idNhanVien } = req.query;
    const filter = idNhanVien ? { idNhanVien } : {};
    const congViec = await CongViecModel.find(filter).populate("idNhanVien");
    res.status(200).json(congViec);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách công việc" });
  }
};

