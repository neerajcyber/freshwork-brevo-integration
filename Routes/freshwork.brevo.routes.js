const express= require('express');
const { insertDataPerPage,  insertContactById } = require('../Controller/freshworks.brevo.controller');
const router = express.Router();

router.post('/insert-contracts-by-page',insertDataPerPage);
router.post('/insert-contract/:id', insertContactById)

module.exports= router