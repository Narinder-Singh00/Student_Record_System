import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const StudentForm = ({ fetchStudents, currentStudent, setCurrentStudent }) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    course: '',
    age: '',
  });

  useEffect(() => {
    if (currentStudent) {
      setFormData(currentStudent);
    } else {
      setFormData({ name: '', rollNo: '', email: '', course: '', age: '' });
    }
  }, [currentStudent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Client-side Validation Rules
  const validateForm = () => {
    const { name, rollNo, email, course, age } = formData;

    if (!name.trim() || !rollNo.trim() || !email.trim() || !course.trim() || !age) {
      toast.warn('Please fill in all required fields.');
      return false;
    }

    // Email pattern validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warn('Please enter a valid email address.');
      return false;
    }

    // Age validation
    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 5 || numAge > 100) {
      toast.warn('Age must be a valid number between 5 and 100.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation first
    if (!validateForm()) return;

    // Get JWT token from browser storage
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in to manage student records.');
      return;
    }

    const url = currentStudent
      ? `http://localhost:5000/api/students/${currentStudent._id}`
      : 'http://localhost:5000/api/students';
    const method = currentStudent ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Pass JWT token here
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          currentStudent
            ? 'Student record updated successfully! 🎉'
            : 'New student added successfully! 🚀'
        );
        fetchStudents();
        setFormData({ name: '', rollNo: '', email: '', course: '', age: '' });
        setCurrentStudent(null);
      } else {
        // Backend returned an error (e.g., duplicate roll number or invalid token)
        toast.error(data.message || 'Failed to save student record.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Server error. Please try again later.');
    }
  };

  return (
    <div className="card">
      <h2>{currentStudent ? 'Edit Student' : 'Add New Student'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number (e.g. CS101)"
          value={formData.rollNo}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
        >
          <option value="">Select Course</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
        </select>
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />
        <div className="btn-group">
          <button type="submit" className="btn primary">
            {currentStudent ? 'Update Student' : 'Add Student'}
          </button>
          {currentStudent && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => setCurrentStudent(null)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;