const express = require('express')
const clientRouter = express.Router()

const clientController = require('../controllers/clientController')
const multer = require('../middleware/multer')
const jwtAuthentication = require('../middleware/jwtAuthentication')

clientRouter.get('/blog',jwtAuthentication,clientController.fullBlogGet)
clientRouter.get('/blog/singleGet/:id',jwtAuthentication,clientController.getsingleBlog)
clientRouter.get('/blog/getDrafs',jwtAuthentication,clientController.drafetdBlogs)
clientRouter.get('/blog/postedBlogs',jwtAuthentication,clientController.postedBlogs)
clientRouter.get('/blog/scheduledBlogs',jwtAuthentication,clientController.scheduledBlogs)
clientRouter.post('/blog',jwtAuthentication,multer.upload,clientController.blogPost)
clientRouter.post('/blog/rescedule',jwtAuthentication,clientController.reschedule)
clientRouter.put('/blog/:id',jwtAuthentication ,multer.upload,clientController.updateBlog)
clientRouter.delete('/blog/:id',jwtAuthentication,clientController.deleteBlog)


module.exports = clientRouter

