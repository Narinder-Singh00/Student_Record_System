import { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import Login from './components/Login';
import './index.css';

function App() {
  // Authentication States
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Student CRUD, Search, Filter & Pagination States
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Fetch Student Records
  const fetchStudents = async () => {
    try {
      const queryParams = new URLSearchParams({
        search,
        course: courseFilter,
        page,
        limit: 5,
      });

      const response = await fetch(
        `http://localhost:5000/api/students?${queryParams}`
      );
      const data = await response.json();

      setStudents(data.students || []);
      setTotalPages(data.pages || 1);
      setTotalStudents(data.total || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Re-fetch when search, filter, page, or authentication state changes
  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [search, courseFilter, page, token]);

  // Handlers for Search and Filter
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCourseChange = (e) => {
    setCourseFilter(e.target.value);
    setPage(1);
  };

  // Auth Handlers
  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('token'));
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setStudents([]);
  };

  return (
    <div className="container">
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1>🎓 Student Record Management System</h1>
        {token && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>
              Welcome, <strong>{user.name}</strong>
            </span>
            <button className="btn secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      {!token ? (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <main className="grid">
          <StudentForm
            fetchStudents={fetchStudents}
            currentStudent={currentStudent}
            setCurrentStudent={setCurrentStudent}
          />
          <StudentList
            students={students}
            fetchStudents={fetchStudents}
            setCurrentStudent={setCurrentStudent}
            search={search}
            onSearchChange={handleSearchChange}
            courseFilter={courseFilter}
            onCourseChange={handleCourseChange}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            totalStudents={totalStudents}
          />
        </main>
      )}
    </div>
  );
}

export default App;