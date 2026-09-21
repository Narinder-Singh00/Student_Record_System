import express from 'express';
import Student from '../models/Student.js';
import { protect } from '../middleware/authMiddleware.js'; // 1. Import authentication middleware

const router = express.Router();

// GET all students (Public access - Search, Filter, Pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const course = req.query.course || '';

    // Build filter query dynamically
    const query = {};

    // Search across Name or Roll Number (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by exact course match if selected
    if (course) {
      query.course = course;
    }

    // Get total matching count for pagination math
    const total = await Student.countDocuments(query);

    // Fetch paginated results
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      students,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new student (PROTECTED)
router.post('/', protect, async (req, res) => {
  const { name, rollNo, email, course, age } = req.body;
  try {
    const newStudent = new Student({ name, rollNo, email, course, age });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update student (PROTECTED)
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE student (PROTECTED)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;