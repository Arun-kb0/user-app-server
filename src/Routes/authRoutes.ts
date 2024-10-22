import express from 'express'
import { handleRefreshToken, login, logout } from '../controller/authController'

const router = express.Router()


router.post('/login', login)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)


export default router