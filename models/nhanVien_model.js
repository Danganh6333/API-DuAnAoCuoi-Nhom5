const db = require("./db");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();
const chuoi_ky_tu_bi_mat = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt");
const nhanVienSchema = new db.mongoose.Schema(
  {
    hoTen: {
      type: String,
    },
    tenNguoiDung: {
      type: String,
      require: true,
    },
    matKhau: {
      type: String,
    },
    email: {
      type: String,
    },
    vaitro: {
      type: Number,
      require: true,
      default: 0,
    },
    diaChi: {
      type: String,
    },
    dienThoai: {
      type: String,
    },
    ghiChu: {
      type: String,
    },
  },
  {
    collection: "nhanviens",
  }
);
/**
 * Hàm tạo token để đăng nhập với API
 * @returns {Promise<*>}
 */
nhanVienSchema.methods.generateAuthToken = async function () {
  const nhanVien = this;
  console.log(nhanVien);
  const token = jwt.sign(
    { _id: nhanVien._id, username: nhanVien.email },
    chuoi_ky_tu_bi_mat
  );
  nhanVien.token = token;
  await nhanVien.save();
  return token;
};

/**
 * Hàm tìm kiếm user theo tài khoản
 * @param email
 * @param matKhau
 * @returns {Promise<*>}
 */
nhanVienSchema.statics.findByCredentials = async (email, matKhau) => {
  const nhanVien = await NhanVienModel.findOne({ email: email });
  if (!nhanVien) {
    throw new Error("Không tồn tại user");
  }
  const isPasswordMatch = await bcrypt.compare(matKhau, nhanVien.matKhau);
  if (!isPasswordMatch) {
    throw new Error("Sai password");
  }
  return nhanVien;
};
const NhanVienModel = db.mongoose.model("NhanVienModel", nhanVienSchema);
module.exports = { NhanVienModel };
