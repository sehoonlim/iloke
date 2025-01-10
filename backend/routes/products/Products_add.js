/*
const express = require('express');
const app = express();
const router = express.Router()
const upload = require('../../config/multerConfig')

module.exports = ()=>{
    app.post('/add',upload.single('p_img'),(req,res)=>{
        console.log(req.file);
        let sql = 'insert into products(name, p_img, price, discount, detail_img, quan, status, benefit, reg_id, reg_date)'
            sql +='VALUES (?,?,?,?,?,?,?,?,?,sysdate())'
        let newFName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
        let data = [
            req.body.name,
            newFName,
            req.body.price,
            req.body.discount,
            req.body.detail_img,
            req.body.quan,
            req.body.status,
            req.body.benefit,
            null
        ]
        console.log(data)
        conn2.query(sql, data,(err,ret)=>{
            if(err){
                console.log('상품등록 sql실패:',err.message)
                res.status(500).json({ error: 'Database error' });
            }else{
                const insertId = ret.insertId;
                console.log('삽입된 코드 : ', insertId)
                res.json(ret)
            }
        })

    })
    return router
}*/