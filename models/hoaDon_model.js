const db = require("./db");
const hoaDonSchema = new db.mongoose.Schema(
  {
    idNhanVien: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "NhanVienModel",
    },
    idKhachHang: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "KhachHangModel",
    },
    idDichVus: [{
      idDichVu: {
        type: db.mongoose.Schema.Types.ObjectId,
        ref: "DichVuModel",
      }
    }],
    ngayTao: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    tongTien: {
      type: Number,
      require: true,
    },
  },
  {
    collection: "hoadons",
  }
);
const HoaDonModel = db.mongoose.model("HoaDonModel", hoaDonSchema);
module.exports = { HoaDonModel };
