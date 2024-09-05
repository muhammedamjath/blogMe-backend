const express = require('express')
const clientRouter = express.Router()

const clientController = require('../controllers/clientController')
const multer = require('../middleware/multer')
const jwtAuthentication = require('../middleware/jwtAuthentication')

clientRouter.post('/blog',jwtAuthentication,multer.upload,clientController.blogPost)
clientRouter.get('/blog',jwtAuthentication,clientController.fullBlogGet)


module.exports = clientRouter

