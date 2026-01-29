
import { noteModel } from "../../DB/model/index.js";
import { ErrorExeption } from "../../common/utils/index.js";
import mongoose from "mongoose";

// 1
// Create a Single Note
// Get the id for the logged-in user (userId) from the token not the body
// send the token in the headers

export const createNote = async (userId, inputs) => {
  const note = await noteModel.create({ ...inputs, userId });
  return note;
};

// -----------------------------------------------------------------------
// 2
// Update a single Note by its id
// Get the id for the logged-in user (userId) from the token not the body
// Only the owner of the note can make this operation
// return the updated note

export const updatedNoteById = async (userId, noteId, inputs) => {
  const { content, title } = inputs;

  const findNote = await noteModel.findById(noteId);
  if (!findNote) {
    ErrorExeption({ message: "Note not found", cause: 404 });
  }

  if (findNote.userId.toString() !== userId.toString()) {
    ErrorExeption({ message: "You are not the owner", cause: 404 });
  }

  if (title !== findNote.title) {
    ErrorExeption({ message: "You cannot update the title" , cause:404});
  }

  const updatedNote = await noteModel.updateOne({ content });

  return updatedNote;
};

// -----------------------------------------------------------------------
//3
// Replace the entire note document with the new data provided in the request body
// Only the owner of the note can make this operation
// Get the id for the logged-in user (userId) from the token not the body

export const ReplacedNote = async (userId, noteId, inputs) => {
  const findNote = await noteModel.findById(noteId);

  if (!findNote) {
    ErrorExeption({ message: "Note not found" , cause:404});
  }

  if (findNote.userId.toString() !== userId.toString()) {
    ErrorExeption({ message: "You are not the owner", cause:404 });
  }

  const updatedNote = await noteModel.updateOne(inputs);

  return updatedNote;
};

// --------------------------------------------------------------
// 4
//Updates the title of all notes created by a logged-in user.
// Get the new Title from the body
// Get the id for the logged-in user (userId) from the token not the body)

export const updateTitleForAllNotes = async (userId, newTitle) => { 

    console.log(newTitle);
    
    const allNotes = await noteModel.find({ userId });
    
    if (allNotes.length === 0) {
        ErrorExeption({ message: "No notes found", cause:404 });
    }

    console.log(allNotes);
    

    const notes = await noteModel.updateMany(
      { userId },
      { $set: { title: newTitle } },
    );

    
    return notes;
}

// --------------------------------------------------------------
// 5
// Delete a single Note by its id
// return the deleted note
// Only the owner of the note can make this operation
// Get the id for the logged-in user from the token not the body

export const deleteNoteById = async (userId, noteId) => {
    const findNote = await noteModel.findById(noteId);

    if (!findNote) {
        ErrorExeption({ message: "Note not found", cause:404 });
    }

    if (findNote.userId.toString() !== userId.toString()) {
      ErrorExeption({ message: "You are not the owner", cause: 404 });
    }

    const deletedNote = await noteModel.findByIdAndDelete(noteId);

    return deletedNote;
}

// --------------------------------------------------------------
// 6
// Retrieve a paginated list of notes for the logged-in user
//  sorted by “createdAt” in descending order.
// Get page and limit from query parameters
// Get the id for the logged-in user (userId) from the token not the body
// send the token in the headers

export const getAllNotes = async (userId, query) => {

    const notesOfUser = await noteModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit);
    
    if (notesOfUser.length === 0) {
        ErrorExeption({ message: "No notes found", cause:404 });
    }
    
    return notesOfUser;
}
 
// --------------------------------------------------------------
// 7
//Get a note by its id
// Only the owner of the note can make this operation
// Get the id for the logged-in user (userId) from the token not the body

export const getNoteById = async (userId, noteId) => {
    const findNote = await noteModel.findById(noteId);

    if (!findNote) {
        ErrorExeption({ message: "Note not found", cause:404 });
    }       

    if (findNote.userId.toString() !== userId.toString()) {
        ErrorExeption({ message: "You are not the owner", cause: 404 });
    }

    return findNote;
}

// --------------------------------------------------------------
// 8
// Get a note for logged-in user by its content.
// Get the id for the logged-in user (userId) from the token not the body

export const getNoteByContent = async (userId, content) => {

    const findNote = await noteModel.findOne({ userId, content });

    if (!findNote) {
        ErrorExeption({ message: "Note not found", cause:404 });
    }
    return findNote;
}

// --------------------------------------------------------------

//9
//Retrieves all notes for the logged-in user with user information
// selecting only the “title, userId and createdAt” from the note
// selecting the “email” from the user

export const getNotesWithUserInfo = async (userId) => {

    const notes = await noteModel.find({ userId })
        .select("title userId createdAt")
        .populate({ path: "userId", select: "email -_id" });    
    
    if (notes.length === 0) {
        ErrorExeption({ message: "No notes found", cause:404 });
    }

    return notes;
}

// --------------------------------------------------------------

//10
// Using aggregation, retrieves all notes for the logged-in user
// with user information (name and email)
// allow searching notes by the title.


export const getNotesWithUserInfoAgg = async (userId, title) => {
  

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // dynamic match
  const matchStage = {
    userId: userObjectId,
  };

  if (title) {
    matchStage.title = title;
  }

  const notes = await noteModel.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },

    {
        $project: {
          _id: 0,
        title: 1,
        userId: 1,
        createdAt: 1,
        user: {
          name: 1,
          email: 1,
        },
      },
    },
  ]);

  if (notes.length === 0) {
    throw ErrorExeption({ message: "No notes found", cause: 404 });
  }

  return notes;
};

// --------------------------------------------------------------

//11
// Delete all notes for the logged-in user.

export const deleteAllNotesOfUser = async (userId) => {
    const deletedNotes = await noteModel.deleteMany({ userId });

    if (deletedNotes.deletedCount === 0) {
        ErrorExeption({ message: "No notes found", cause:404 });
    }
    return deletedNotes;
}