var express = require("express");
var router = express.Router();
const dichVuControl = require("../controller/dichVu_controller");
const upload = require("../upload");
router.get("/getDichVu", dichVuControl.getListDichVu);
router.post("/addDichVu", dichVuControl.addDichVu);
router.put("/updateDichVu/:id", dichVuControl.updateDichVu);
router.delete("/deleteDichVu/:id", dichVuControl.deleteDichVu);
router.get("/searchDichVuByPrice",dichVuControl.searchDichVuByPrice)
router.post('/addDichVuWithImage', upload.single('anhDichVu'), dichVuControl.addDichVuWithImage);
router.put("/updateDichVuStatus/:id", dichVuControl.updateDichVuStatus);
module.exports = router;
