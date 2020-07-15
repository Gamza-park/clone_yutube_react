const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const multer = require("multer");
const { auth } = require("../middleware/auth");
var ffmpeg = require("fluent-ffmpeg");
const {Subscriber} = require('../models/Subscriber');


let storage = multer.diskStorage({
    // STORAGE MULTER CONFIG
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 file is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    // Save Video In Server
    upload(req, res, err =>{
        if(err){
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/uploadVideo', (req, res) => {
    // Save Video Info

    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success:true })
    });

})

router.post('/getSubscriptionVideos', (req, res) => {
    // Find Subscription 
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })

    // FindSubscription Video

        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })

})

router.get('/getVideos', (req, res) => {
    // Get Video for DB And Send client

    Video.find()
    .populate('writer')
    .exec((err, videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos })
    })
})

router.post('/getVideoDetail', (req, res) => {
    
    Video.findOne({ "_id": req.body.videoId })
    .populate('writer')
    .exec((err, videoDetail) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({ success: true, videoDetail })
    })
})

router.post('/thumbnail', (req, res) => {
    
    // Make Thumbnail and Get Video Running Time

    let filePath = "";
    let fileDuration = "";

    // Get Video Info
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    // Make Thumbnail

    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration})
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });

});

module.exports = router;
