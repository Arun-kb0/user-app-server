import express from 'express'
import { createUser, deleteUser, getAllUsers, updateUser } from '../controller/usersController'

const router = express.Router()

router.get('/', getAllUsers)
router.route('/user')
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser)

export default router