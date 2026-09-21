import { toast } from 'react-toastify';

const StudentList = ({
  students,
  fetchStudents,
  setCurrentStudent,
  search,
  onSearchChange,
  courseFilter,
  onCourseChange,
  page,
  setPage,
  totalPages,
  totalStudents,
}) => {
  const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this record?')) {
    try {
      // Get saved token from localStorage
      const token = localStorage.getItem('token');

      // Check if token exists before making request
      if (!token) {
        toast.error('You must be logged in to delete records.');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Pass JWT token here
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Student record deleted.');
        fetchStudents();
      } else {
        toast.error(data.message || 'Failed to delete student.');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Server error while deleting.');
    }
  }
};
  return (
    <div className="card">
      <div className="list-header">
        <h2>Student Records ({totalStudents})</h2>
      </div>

      {/* Controls */}
      <div className="controls-grid">
        <input
          type="text"
          placeholder="Search by Name or Roll No..."
          value={search}
          onChange={onSearchChange}
          className="search-input"
        />
        <select
          value={courseFilter}
          onChange={onCourseChange}
          className="filter-select"
        >
          <option value="">All Courses</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
        </select>
      </div>

      {/* Table */}
      {students.length === 0 ? (
        <p className="no-data">No student records found.</p>
      ) : (
        <>
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.age}</td>
                  <td>
                    <button
                      className="btn edit"
                      onClick={() => setCurrentStudent(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="btn secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>
              Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
            </span>
            <button
              className="btn secondary"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;