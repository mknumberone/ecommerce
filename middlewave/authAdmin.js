const Users = require('../models/userModel')

const authAdmin = async (req, res, next) =>{
    try {
        // Lấy thông tin người dùng bằng ID
        const user = await Users.findOne({
            _id: req.user.id
        })
        if(user.role === 0)
            return res.status(400).json({msg: "Quyền truy cập tài nguyên quản trị viên bị từ chối"})

        next()
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin