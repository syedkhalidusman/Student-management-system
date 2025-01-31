import React, { useState, useEffect } from "react";
import axios from "axios";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/subjects");
        setSubjects(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch subjects. Please try again.");
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.subjectName.trim()) {
      alert("Subject name is required.");
      return;
    }
    if (!newSubject.description.trim()) {
      alert("Description is required.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/subjects", newSubject);
      setSubjects([...subjects, response.data]);
      setNewSubject({ subjectName: "", description: "" });
      alert("Subject added successfully");
    } catch (error) {
      console.error("Failed to add subject:", error);
      alert("Failed to add subject. Please try again.");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/subjects/${id}`);
      setSubjects(subjects.filter((subject) => subject._id !== id));
      alert("Subject deleted successfully");
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Failed to delete subject. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-gray-200 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Subjects</h2>

      <form onSubmit={handleAddSubject} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium">Subject Name</label>
          <input
            type="text"
            name="subjectName"
            value={newSubject.subjectName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={newSubject.description}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Subject
        </button>
      </form>

      <div>
        <h3 className="text-xl font-bold mb-4">Existing Subjects</h3>
        {loading ? (
          <p>Loading subjects...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : subjects.length === 0 ? (
          <p>No subjects available.</p>
        ) : (
          <ul>
            {subjects.map((subject) => (
              <li
                key={subject._id}
                className="p-2 border-b border-gray-700 flex justify-between items-center"
              >
                <div>
                  <strong>{subject.subjectName}</strong> - {subject.description}
                </div>
                <button
                  onClick={() => handleDeleteSubject(subject._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Subjects;
