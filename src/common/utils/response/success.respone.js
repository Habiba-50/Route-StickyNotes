export  const successResponse = (res, status = 200, data= undefined, message="Done") => {
    return res.status(status).json({message:{message},data})
}