import { Router } from "express";
import { createNote, deleteAllNotesOfUser, deleteNoteById, getAllNotes, getNoteByContent, getNoteById, getNotesWithUserInfo, getNotesWithUserInfoAgg, ReplacedNote, updatedNoteById, updateTitleForAllNotes } from "./note.service.js";
import { successResponse } from "../../common/utils/index.js";
import { auth } from "../../middleware/index.js";
import { deleteModel } from "mongoose";

const router = Router()

// Create Note
router.post("/", auth(), async (req, res, next) => {
    const result = await createNote(req.user._id, req.body);
    return successResponse(res, 201, { result });
})


// Update title for all notes of a user
router.patch("/all", auth(), async (req, res, next) => {
  const newTitle  = req.body.title;

  const result = await updateTitleForAllNotes(req.user._id, newTitle);

  return successResponse(res, 201, "All notes updated");
});


// Update Note by Id
router.patch("/:noteId", auth(), async (req, res, next) => {
    const noteId = req.params.noteId;

    const result = await updatedNoteById(req.user._id, noteId, req.body);
    return successResponse(res, 201, { result }, "updated Successfully");
 })


// Replace Note by Id
router.put("/:noteId", auth(), async (req, res, next) => {
    const noteId = req.params.noteId;
    const result = await ReplacedNote(req.user._id, noteId, req.body);
    return successResponse(res, 201, { result });
})



// Delete Note by Id
router.delete("/:noteId", auth(), async (req, res, next) => { 
    const noteId = req.params.noteId;
    const result = await deleteNoteById(req.user._id, noteId);
    return successResponse(res, 200, { result }, " deleted Successfully");
})

// Get all notes of a user
router.get("/paginate-sort", auth(), async (req, res, next) => {

    const result = await getAllNotes(req.user._id, req.query);
    return successResponse(res, 200, { result });
});


// Get note by content
router.get("/note-by-content", auth(), async (req, res, next) => {
    const content = req.query.content;
    console.log(content);
    
    const result = await getNoteByContent(req.user._id, content);
    return successResponse(res, 200, { result });
});


// Get notes with user info
router.get("/note-with-user", auth(), async (req, res, next) => {
    const result = await getNotesWithUserInfo(req.user._id);
    return successResponse(res, 200, { result });
});

// get Notes With User Info Agg
router.get("/aggregate", auth(), async (req, res, next) => {
    const title = req.query.title;
    const result = await getNotesWithUserInfoAgg(req.user._id, title);
    return successResponse(res, 200, { result });
});

// Get note by Id
router.get("/:noteId", auth(), async (req, res, next) => {
    const noteId = req.params.noteId;
    const result = await getNoteById(req.user._id, noteId);
    return successResponse(res, 200, { result });
});


router.delete("/", auth(), async (req, res, next) => { 
    const result = await deleteAllNotesOfUser(req.user._id);
    return successResponse(res, 200, { result }, "Deleted");
})





export default router;