const {Router} = require('express');
const router = Router();

const {PublicationController} = require('../Controllers/Index.controller');
const {PublicationModel} = require('../Models/Index.models.js');
const {AuthMiddleware, UploadFilesMiddleware, FolderMiddleware} = require('../middlewares/Index.middleware');

router.get('/test', PublicationController.test);
router.get('/get/:id', PublicationController.getPublication);
router.post('/create', AuthMiddleware, PublicationController.postPublication);
router.delete('/delete/:id', AuthMiddleware, PublicationController.deletePublication);
router.get('/getAll/:id/:page?', AuthMiddleware, PublicationController.getPublications);
router.post('/saveFile/:id', [AuthMiddleware, CheckEntityMiddleware(PublicationModel, 'id'), FolderMiddleware.setFolder('publications'), UploadFilesMiddleware], PublicationController.uploadMedia);
router.get('/file/:id', PublicationController.getMedia);
router.get('/feed/:page?', AuthMiddleware, PublicationController.feed);

module.exports = router;
