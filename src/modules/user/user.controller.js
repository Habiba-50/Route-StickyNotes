import { Router } from 'express'
import {  deleteLoginUser, getUserData, login, signup, updateLoginInfo } from './user.service.js';
import { successResponse } from '../../common/utils/response/index.js';
import { auth } from '../../middleware/index.js';
const router = Router(); 

// Signup
router.post("/signup", async (req, res, next) => {
    const result = await signup(req.body)
    return successResponse(res, 201, { result }, "User added Successfully");
})

// Login
router.post("/login", async (req, res, next) => {
    const result = await login(req.body)
    return successResponse(res, 201, { token:  result }, "login Successfully");
})

//update
router.patch("/", auth(), async (req, res, next) => {
    console.log(req.user);
    const result = await updateLoginInfo(req.user._id,req.body)
    return successResponse(res, 201, { result }, "Updated Successfully");
})

// Delete 
router.delete("/", auth(), async (req, res, next) => {
    const result = await deleteLoginUser(req.user._id);
    return successResponse(res, 200, { result }, "User deleted Successfully");
})

// Get user info
router.get("/", auth(), async (req, res, next) => { 
    const result = await getUserData(req.user._id);
    return successResponse(res, 200, { result },);
})


export default router