import express from 'express'
import { handleRefreshToken, login, logout, signup } from '../controller/authController'

const router = express.Router()


router.post('/signup', signup)
router.post('/login', login)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)


export default router