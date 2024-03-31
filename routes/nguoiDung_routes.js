var express = require("express");
var router = express.Router();
const apiCtrl = require("../controller/nguoidung_controller");
router.post('/login', apiCtrl.doLogin);
router.post('/reg', apiCtrl.doReg);
router.get('/check/:email',apiCtrl.checkExistedUser);
module.exports = router;
