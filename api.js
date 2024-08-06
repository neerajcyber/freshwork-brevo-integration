const express =require('express');
const router = express.Router();

router.get('/get-data',(req, res)=>{

    try {
        return res.status(200).json({msg:"Working"})
    } catch (error) {
        console.log(error);
    }
})

module.exports= router;

