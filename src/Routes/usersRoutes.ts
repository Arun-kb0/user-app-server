import express from 'express'
import { getHome, getProfile } from '../controller/usersController'

const router = express.Router()


router.get('/', getHome)
router.get('/profile',getProfile)


export default router