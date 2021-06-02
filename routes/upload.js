const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middlewave/auth')
const authAdmin = require("../middlewave/authAdmin")
const fs = require('fs')
// we will upload image on cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// Upload image only admin can use
router.post('/upload',auth , authAdmin, (req, res) =>{
    try {
       console.log(req.files);
       if(!req.files || Object.keys(req.files).length===0)
       return res.status(400).json({msg:'Không có tập tin nào được cập nhật!'})
  
       const file = req.files.file
       if(file.size > 1024*1024) {
           removeTmp(file.tempFilePath)
           return res.status(400).json({msg:'Tập tin quá lớn'}) // nếu file có kick thước  lớn hơn 1mb
       }

       if(file.mimetype !== 'image/jpeg' && file.minetype !== 'image/png' )
       {
           removeTmp(file.tempFilePath)
           return res.status(400).json({msg:'Định dạng không hợp lệ!'}) // nếu file có kick thước  lớn hơn 1mb
       }

       cloudinary.v2.uploader.upload(file.tempFilePath, {folder:"test"} , async(err ,result)=>{
           if(err) throw err
           //Sau khi upload ta cos file tmp
           removeTmp(file.tempFilePath)
           res.json({public_id:result.public_id ,url:result.secure_url})
       })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})
//Delete image
router.post('/destroy',auth,authAdmin,(req, res)=>{
   try {
       const {public_id}=req.body
       if(!public_id) res.status(400).json({msg:'Không có ảnh nào được chọn'})
   
       cloudinary.v2.uploader.destroy(public_id,async(err,result)=>{
           if(err) throw err
            res.json({msg:"Xóa ảnh!"})
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
   }
})

const removeTmp = (path)=>{
  fs.unlink(path,err=>{
      if(err) throw err
  })
}


module.exports = router