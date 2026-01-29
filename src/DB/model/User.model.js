import mongoose from "mongoose"
import { ErrorExeption } from "../../common/utils/index.js"

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate: {
            validator: function (value) {
                if (value >= 18 && value <= 60) {
                    return true
                } else {   
                    ErrorExeption({ message: "Age must be between 18 and 60" })
                }
            }
        }
    }
},{})


export const userModel =  mongoose.models.User || mongoose.model('User', userSchema);



