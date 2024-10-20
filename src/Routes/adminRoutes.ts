import express from 'express'
import { createUser, getAllUsers } from '../controller/usersController'

const router = express.Router()

router.get('/', getAllUsers)
router.route('/user')
  .post(createUser)


export default router