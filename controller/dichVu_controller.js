const { DichVuModel } = require("../models/dichVu_model");
const mongoose = require("mongoose");
var express = require("express");
var router = express.Router();

const Upload = require("../upload");
const COMMON = require("../COMMON");
exports.getListDichVu = async (req, res, next) => {
  try {
    await mongoose.connect(COMMON.uri);
    const dichVus = await DichVuModel.find();
    console.log(dichVus);
    res.send(dichVus);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      messenger: "Lỗi Server",
      data: [],
    });
  }
};
exports.addDichVu = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const newDichVu = new DichVuModel({
      tenDichVu: req.body.tenDichVu,
      trangThai: req.body.trangThai,
      moTa: req.body.moTa,
      giaTien: req.body.giaTien,
    });

    const result = await newDichVu.save();

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
exports.deleteDichVu = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { id } = req.params;
    const result = await DichVuModel.findByIdAndDelete(id);

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
exports.updateDichVu = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { id } = req.params;
    const data = req.body;
    const updateDichVu = await DichVuModel.findById(id);

    let result = null;
    if (updateDichVu) {
      updateDichVu.tenDichVu = data.tenDichVu ?? updateDichVu.tenDichVu;
      updateDichVu.trangThai = data.trangThai ?? updateDichVu.trangThai;
      updateDichVu.moTa = data.moTa ?? updateDichVu.moTa;
      updateDichVu.giaTien = data.giaTien ?? updateDichVu.giaTien;
      result = await updateDichVu.save();
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
exports.updateDichVuStatus = async (req, res, next) => {
  await mongoose.connect(COMMON.uri);
  try {
    const { id } = req.params;
    const data = req.body;
    const updateDichVu = await DichVuModel.findById(id);

    let result = null;
    if (updateDichVu) {
      updateDichVu.trangThai = data.trangThai ?? updateDichVu.trangThai;
      result = await updateDichVu.save();
    }

    if (result) {
      res.json({
        status: 200,
        messenger: "Cập nhật trạng thái thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Lỗi, cập nhật trạng thái không thành công",
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
exports.searchDichVuByPrice = async (req, res, next) => {
  const { giaTien_start, giaTien_end } = req.query;
  const query = { giaTien: { $gte: giaTien_start, $lte: giaTien_end } };
  const data = await DichVuModel.find(query, "tenDichVu trangThai moTa giaTien")
    .skip(0) //bỏ qua số lượng hàng;
    .limit(2); //lấy 2 sản phẩm
  res.json({
    status: 200,
    messenger: "Danh sách dịch vụ theo giá tiền",
    data: data,
  });
};

exports.addDichVuWithImage = async (req, res, next) => {
  const file = req.file;
  const imageUrl = `${req.protocol}://localhost:${req.get("host")}/uploads/${
    file.filename
  }`;
  try {
    const newDichVu = new DichVuModel({
      tenDichVu: req.body.tenDichVu,
      trangThai: req.body.trangThai,
      anhDichVu: imageUrl,
      moTa: req.body.moTa,
      giaTien: req.body.giaTien,
    });

    const result = await newDichVu.save();

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
