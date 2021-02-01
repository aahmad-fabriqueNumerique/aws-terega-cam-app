const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require ('multer-s3')
const path = require('path')
const fs = require('fs')


const access_key_id = process.env.ACCESS_KEY_ID
const secret_access_key= process.env.SECRET_ACCESS_KEY
const region = process.env.REGION

const app = express()
const s3 = new aws.S3({apiVersion:'2006-03-01'})

//fs.unlink('/home/osm/Images/qqq.png', function (err) {
 //   if (err) throw err;
   // console.log('successfully deleted /tmp/hello');
  //});

aws.config.update({
    accessKeyId: access_key_id,
    secretAccessKey: secret_access_key,
    "region": region  
});

const upload = multer({
    storage : multerS3({
        s3 : s3,
        bucket : 'osmterega',
        metadata : (req , file , cb) => {
            cb(null, { fileName : file.fieldname})
        },
        key : (req , file , cb) => {
            const ext = path.basename(file.originalname)
            cb(null , ext)
        }
    })
})

// app.post('/upload/', (req, res) => {
//     const { base64 } = req.params
//    const test = req.body

//     console.log(test);
// })

app.use(express.static('public'))

app.post('/upload',upload.array('avatar'),(req,res)=>{
  return res.json({status : "ok", uploaded:req.files.length})
})

app.listen(3001, ()=>{console.log('app is listening')})
