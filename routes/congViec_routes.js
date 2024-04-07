var express = require("express");
var router = express.Router();
const CongViecControl = require("../controller/congViec_controller");
router.get("/getCongViec", CongViecControl.getListCongViec);
router.post("/addCongViec", CongViecControl.addCongViec);
router.put("/updateCongViec/:id", CongViecControl.updateCongViec);
router.delete("/deleteCongViec/:id", CongViecControl.deleteCongViec);
router.get('/searchCongViec/:id',CongViecControl.searchCongViecTheoId)
router.get('/searchCongViecTheoNhanVien/:id',CongViecControl.getListCongViecTheoNhanVien)
module.exports = router;