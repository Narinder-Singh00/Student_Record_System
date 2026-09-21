import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    course: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);