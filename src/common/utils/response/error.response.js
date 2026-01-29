import { NODE_ENV } from "../../../../config/config.service.js"

export const golbalErrorHandeling = (error, req, res, next) => {
        const status = error.cause?.status ?? 500
        return res.status(status).json({
            error_message:
                status == 500 ? 'something went wrong' : error.message ?? 'something went wrong',
            stack: NODE_ENV == "development" ? error.stack : undefined,
            extra:error.cause?.extra
        })
}
    

export const ErrorExeption = ({ message = "Fail", cause = undefined } = {}) => {

  throw new Error(message, { cause })
}



export const notFoundError = ({ message , extra = { } } = {}) => {
    return ErrorExeption({ message, cause: { status: 404 , extra } })
}

// If login failed, we will call this function
// search in user model if user not found
// if user try to create note and user not found
//return notFoundError("Invalid login credentials")