import mongoose, { Schema } from "mongoose";
import { ErrorExeption } from "../../common/utils/index.js";

 const noteSchema = new Schema({

    title: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                if (value === value.toUpperCase()) {
                    ErrorExeption({message:"Title must not be in uppercase"})
                }
            }
        }
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

export const noteModel = mongoose.models.Note || mongoose.model('Note', noteSchema)