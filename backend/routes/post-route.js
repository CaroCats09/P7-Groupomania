const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post-ctrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//CRUD
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/:id', auth, postCtrl.getOnePost);
router.get('/', auth, postCtrl.getAllPost);
router.post('/:id/like', auth, postCtrl.likeOrDislike);

module.exports = router;