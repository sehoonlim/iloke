const express = require('express');

const conn = require('../../db')
const fs =  require('fs')

module.exports = (upload)=>{
    const router = express.Router();

    router.get('/',async (req,res)=>{

        try {
            const [ret] = await conn.execute('select * from exam')
            res.json(ret)
        } catch (err) {  
            console.error('sql 실패 : ', err.message)
            res.status(500).send('db 오류')   
        }    
    })

    return router
}