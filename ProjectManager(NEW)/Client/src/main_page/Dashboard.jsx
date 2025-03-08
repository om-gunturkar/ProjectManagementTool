import React, { useState, useEffect } from "react";
import { FaTasks, FaFolderOpen, FaPlus, FaTrash, FaSort } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import head_logo from "/logo.png";

const Navbar = () => (
  <header className="flex justify-center items-center p-4 border-1 bg-white shadow-2xl w-full">
    <input
      type="text"
      placeholder="Search..."
      className="p-2 border rounded-lg w-full max-w-md"
    />
  </header>
);

const Sidebar = ({ sidebarOpen }) => (
  <div
    className={`fixed inset-y-0 left-0 w-64 bg-white border-1 shadow-2xl p-4 transform transition-transform duration-300 ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0 md:relative`}
  >
    <img src={head_logo} alt="Logo" className="h-[100px] mx-auto mb-4" />

    <nav className="space-y-2">
      {[
        { to: "/dashboard", icon: <FaTasks />, label: "Dashboard" },
      ].map((item, index) => (
        <NavItem key={index} {...item} />
      ))}
    </nav>
  </div>
);

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg !no-underline ${
        isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
      }`
    }
  >
    {icon} <span className="ml-3">{label}</span>
  </NavLink>
);

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [sortByPriority, setSortByPriority] = useState(false); // State for sorting

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const deleteProject = (projectId) => {
    setProjects((prevProjects) => prevProjects.filter((proj) => proj.id !== projectId));
  };

  const updateProjectStatus = (projectId, status) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === projectId ? { ...proj, status } : proj
      )
    );
  };

  // Function to sort projects by priority
  const sortProjectsByPriority = (projects) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return [...projects].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  // Toggle sorting by priority
  const toggleSortByPriority = () => {
    setSortByPriority((prev) => !prev);
  };

  // Get sorted projects based on the state
  const sortedProjects = sortByPriority ? sortProjectsByPriority(projects) : projects;

  return (
    <div className="flex">
      <Sidebar sidebarOpen={true} />
      <div className="flex flex-col flex-grow p-6 bg-gray-100 items-center w-full h-screen">
        <Navbar />
        <h3 className="text-6xl font-semibold mb-6 pt-5">Project List</h3>
        <div className="w-full max-w-6xl">
          <ProjectTable
            projects={sortedProjects}
            deleteProject={deleteProject}
            openModal={openModal}
            updateProjectStatus={updateProjectStatus}
            sortByPriority={sortByPriority}
            toggleSortByPriority={toggleSortByPriority}
          />
        </div>
        {isModalOpen && <ProjectModal closeModal={() => setIsModalOpen(false)} setProjects={setProjects} />}
      </div>
    </div>
  );
};

const ProjectTable = ({ projects, deleteProject, openModal, updateProjectStatus, sortByPriority, toggleSortByPriority }) => (
  <div className="bg-white p-4 shadow-md rounded-lg w-full border-2">
    <h4 className="text-lg font-semibold mb-4 flex justify-between">
      Projects
      <div className="flex items-center space-x-2">
        <button
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={openModal}
        >
          <FaPlus className="w-5 h-5" />
        </button>
        <button
          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          onClick={toggleSortByPriority}
        >
          <FaSort className="mr-2" />
          {sortByPriority ? "Default Order" : "Sort by Priority"}
        </button>
      </div>
    </h4>
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Title</th>
          <th className="border p-2">Priority</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Created At</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.length > 0 ? (
          projects.map((project) => (
            <tr key={project.id} className="text-center">
              <td className="border p-2">
                <Link to={`/project/${project.id}`} className="text-blue-600 hover:underline">
                  {project.title}
                </Link>
              </td>
              <td className="border p-2">{project.priority}</td>
              <td className="border p-2">
                <select
                  value={project.status}
                  onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td className="border p-2">{project.createdAt}</td>
              <td className="border p-2 justify-center" >
                <FaTrash className="cursor-pointer text-red-500" onClick={() => deleteProject(project.id)} />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center p-4">No projects available</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const ProjectModal = ({ closeModal, setProjects }) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Do");

  const addProject = () => {
    if (!projectTitle.trim()) return;

    setProjects((prevProjects) => [
      ...prevProjects,
      {
        id: Date.now(),
        title: projectTitle,
        priority,
        status,
        createdAt: new Date().toLocaleDateString(),
        tasks: [],
      },
    ]);

    setProjectTitle("");
    setPriority("Medium");
    setStatus("To Do");
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Add Project</h3>

        <label className="block text-sm font-medium text-gray-700">Project Title</label>
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
            Cancel
          </button>
          <button onClick={addProject} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;