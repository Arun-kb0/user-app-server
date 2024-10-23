import express from 'express'
import { addProfilePicture, getHome, getProfile } from '../controller/usersController'

const router = express.Router()


router.get('/', getHome)
router.route('/profile')
  .get(getProfile)
  .post(addProfilePicture)

export default router