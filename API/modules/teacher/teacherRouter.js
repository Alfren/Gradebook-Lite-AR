const router = require("express").Router();
const teacherModel = require("./teacherModel");
const studentModel = require("../student/studentModel");
const assignmentModel = require("../assignment/assignmentModel");
const classModel = require("../class/classModel");

router.get("/", async function (req, res) {
  try {
    const response = await teacherModel.find();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get("/:username", async function (req, res) {
  const { username } = req.params;
  try {
    const response = await teacherModel
      .findOne({ username })
      .populate({ path: "classes", select: "title _id" })
      .exec();
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post("/", async function (req, res) {
  const { body } = req;
  try {
    const response = await teacherModel.create(body);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.patch("/:id", async function (req, res) {
  const {
    body,
    params: { id },
  } = req;
  try {
    const response = await teacherModel.findByIdAndUpdate(id, body);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.delete("/:id", async function (req, res) {
  const {
    params: { id },
  } = req;
  try {
    const response = await teacherModel.findByIdAndDelete(id);
    res.send(response);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.delete("/complete/:teacherId", async function (req, res) {
  const { teacherId } = req.params;
  try {
    const classes = await classModel.find({ teacherId });
    Promise.all([
      ...classes.map(async ({ id: classId, students, assignments }) => [
        ...students.map(async (id) => await studentModel.findByIdAndDelete(id)),
        ...assignments.map(
          async (id) => await assignmentModel.findByIdAndDelete(id)
        ),
        await classModel.findByIdAndDelete(classId),
      ]),
      await teacherModel.findByIdAndDelete(teacherId),
    ])
      .then(() => {
        res.send();
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
