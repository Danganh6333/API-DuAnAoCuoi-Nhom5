const db = require('./db');
const dichVuSchema = new db.mongoose.Schema({
    tenDichVu:{
        type:String,
        require:true
    },
    trangThai:{
        type: Number,
        require: true,
        default:1,
    },
    moTa:{
        type: String,
        require: true,
    },
    loaiDichVu:{
        type: Number,
        require: true,
    },
    giaTien:{
        type: Number,
        require: true,
    }

},{
    collection:'dichvus'
}) 
const DichVuModel = db.mongoose.model("DichVuModel",dichVuSchema);
module.exports = {DichVuModel};