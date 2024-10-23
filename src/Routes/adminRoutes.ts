import express from 'express'
import { createUser, deleteUser, getAllUsers, searchUsers, updateUser } from '../controller/usersController'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/search',searchUsers)
router.route('/user')
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser)

export default router