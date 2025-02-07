import { useState } from 'react';
import CustomPagination from '../CustomPagination/CustomPagination';

const ViewAllElderlyUsers = () => {
  // Sample data for demonstration purposes
  const [elderlyUsers, setElderlyUsers] = useState([
    {
      id: 1,
      name: 'Alice Smith',
      age: 78,
      lastHealthLog: '2023-10-01',
      nextAppointment: '2023-10-15',
      healthStatus: 'Stable',
      caregiver: 'John Doe',
      profileImage: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Bob Johnson',
      age: 82,
      lastHealthLog: '2023-09-28',
      nextAppointment: '2023-10-10',
      healthStatus: 'Needs Attention',
      caregiver: 'Jane Doe',
      profileImage: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Carol Williams',
      age: 75,
      lastHealthLog: '2023-09-25',
      nextAppointment: '2023-10-05',
      healthStatus: 'Stable',
      caregiver: 'John Doe',
      profileImage: 'https://via.placeholder.com/150',
    },
    // Add more sample data to test pagination
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 4,
      name: `Elderly User ${i + 4}`,
      age: 70 + i,
      lastHealthLog: '2023-09-20',
      nextAppointment: '2023-10-01',
      healthStatus: i % 2 === 0 ? 'Stable' : 'Needs Attention',
      caregiver: i % 2 === 0 ? 'John Doe' : 'Jane Doe',
      profileImage: 'https://via.placeholder.com/150',
    })),
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Filter and sort logic
  const filteredUsers = elderlyUsers
    .filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'All' || user.healthStatus === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'age') return a.age - b.age;
      if (sortBy === 'lastHealthLog')
        return new Date(b.lastHealthLog) - new Date(a.lastHealthLog);
      return 0;
    });

  // Pagination logic
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle search and navigate to the correct page
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue) {
      // Find the index of the first matching user
      const foundIndex = filteredUsers.findIndex((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
      );

      if (foundIndex !== -1) {
        // Calculate the page number where the user is located
        const pageNumber = Math.ceil((foundIndex + 1) / itemsPerPage);
        setActivePage(pageNumber); // Navigate to the correct page
      }
    } else {
      // If the search term is empty, reset to the first page
      setActivePage(1);
    }
  };

  const handleDeleteUser = (id) => {
    setElderlyUsers(elderlyUsers.filter((user) => user.id !== id));
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-10">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 rounded-lg mb-1">
        <h1 className="text-2xl font-bold text-gray-800">
          View All Elderly Users
        </h1>
        <p className="text-gray-600">
          Manage and monitor all elderly users under your care.
        </p>
      </header>

      {/* Filters and Search Section */}
      <div className="bg-white p-2 rounded-lg shadow-md mb-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search by Name
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch} // Updated to use handleSearch
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Health Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All</option>
              <option value="Stable">Stable</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="lastHealthLog">Last Health Log</option>
            </select>
          </div>
        </div>
      </div>

      {/* Elderly Users List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Elderly Users List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Health Log
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Appointment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Caregiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.healthStatus === 'Stable'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.healthStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastHealthLog}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.nextAppointment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.caregiver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                    <button
                      className="ml-2 text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <CustomPagination
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={filteredUsers.length}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ViewAllElderlyUsers;
