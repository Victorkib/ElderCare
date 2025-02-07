import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileText,
  TrendingUp,
  Calendar,
  User,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/partCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/partCard';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import apiRequest from '../../utils/api';
import { TailSpin } from 'react-loader-spinner';
import { Button } from '@mui/material';
import { HealthAndSafety, Person } from '@mui/icons-material';

const HealthLogs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(5); // Adjust the number of items per page
  const [healthStatusFilter, setHealthStatusFilter] = useState('');
  const [filterVisible, setFilterVisible] = useState(false); // For toggle
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Sample data - in real app, this would come from an API
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const fetchRecentLogs = async () => {
      setLoading(true);
      try {
        const response = await apiRequest.get(
          '/elderHealthLog/getAllHealthLogs'
        );
        if (response.status) {
          setRecentLogs(response.data);
        }
      } catch (error) {
        setError(
          error?.response?.data?.message || 'Error Fetching Recent Logs!'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecentLogs();
  }, []);

  useEffect(() => {
    // Start with all logs
    let filtered = [...recentLogs];

    // Apply search filter (case-insensitive, spaces removed)
    if (searchQuery) {
      filtered = filtered.filter((log) =>
        log.elderlyId.firstName
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(searchQuery.toLowerCase().replace(/\s+/g, ''))
      );
    }

    // Apply health status filter only if a filter is selected
    if (healthStatusFilter) {
      filtered = filtered.filter(
        (log) => log.healthStatus === healthStatusFilter
      );
    }

    // Update the filtered logs state
    setFilteredLogs(filtered);
  }, [searchQuery, healthStatusFilter, recentLogs]);

  // Handle pagination change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current logs for the page
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <div className="p-6 space-y-6 mt-11">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Health Logs Dashboard</h1>
          <p className="text-gray-500">
            Monitor and manage patient health records
          </p>
        </div>
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => navigate('/addHealthLog')}
          >
            <Plus size={20} />
            New Health Log
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mt-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={() => setFilterVisible(!filterVisible)} // Toggle filter visibility
          >
            <Filter size={20} />
            Filters
          </button>
          {/* Dropdown Menu */}
          {filterVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md z-10">
              <div className="p-2">
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  onChange={(e) => setHealthStatusFilter(e.target.value)}
                  value={healthStatusFilter}
                >
                  <option value="">All Health Status</option>
                  <option value="Healthy">Healthy</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Logs</CardTitle>
              <CardDescription>
                View and manage patient health records
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Blood Pressure (mmHg)</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Heart Rate</TableHead>
                    <TableHead>Log Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLogs &&
                    currentLogs.map((log) => (
                      <TableRow
                        key={log?._id}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {log.elderlyId.firstName}
                        </TableCell>
                        <TableCell>{log.bloodPressure}</TableCell>
                        <TableCell>{log.weight}</TableCell>
                        <TableCell>{log.heartRate} (bpm)</TableCell>
                        <TableCell>
                          {log.logDateTime &&
                            new Date(log.logDateTime).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              log.healthStatus === 'Healthy'
                                ? 'bg-green-100 text-green-800'
                                : log.healthStatus === 'At Risk'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {log.healthStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            startIcon={<Person />}
                            onClick={() => {
                              navigate(`/elderProfile/${log?.elderlyId?._id}`, {
                                state: {
                                  elderData: log.elderlyId,
                                },
                              });
                            }}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Profile
                          </Button>
                          <Button
                            startIcon={<HealthAndSafety />}
                            onClick={() =>
                              navigate(`/indiv/${log?.elderlyId?._id}`)
                            }
                            variant="outlined"
                            size="small"
                          >
                            Health Metrics
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {indexOfFirstLog + 1} to {indexOfLastLog} of{' '}
                  {filteredLogs.length} results
                </p>
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={logsPerPage}
                  totalItemsCount={filteredLogs.length}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                  itemClass="inline-flex items-center justify-center min-w-[2.5rem] h-10 border rounded-lg mx-1 hover:bg-gray-50"
                  activeClass="!bg-blue-600 text-white border-blue-600 hover:!bg-blue-700"
                  disabledClass="opacity-50 cursor-not-allowed hover:bg-white"
                  linkClass="w-full h-full flex items-center justify-center"
                  prevPageText="Previous"
                  nextPageText="Next"
                  firstPageText="First"
                  lastPageText="Last"
                  linkClassFirst="px-3"
                  linkClassLast="px-3"
                  linkClassPrev="px-3"
                  linkClassNext="px-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {loading && (
        <div className="loader-overlay">
          <TailSpin
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
    </div>
  );
};

export default HealthLogs;
