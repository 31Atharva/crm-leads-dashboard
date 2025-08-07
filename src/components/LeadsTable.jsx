// import React, { useState, useEffect } from 'react';
// import "./LeadsTable.css";
// import LeadsData from "../data/leads.json";

// const LeadsTable = () => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [filteredLeads, setFilteredLeads] = useState(LeadsData);
    
    
//     useEffect(() => {
//         // Simulating data fetch
//         const filtered = LeadsData.filter(lead =>
//             lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             lead.email.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setFilteredLeads(filtered);
//     },[searchTerm]);
        
// const getStatusClass = (status) => {
//     if (status === 'New') return 'badge-new';
//     if (status === 'In Progress') return 'badge-in-progress';
//     if (status === 'Converted') return 'badge-converted';
// };
    
//     return (
//         <div className="table-container">
//         <h2>CRM Leads</h2>
//         <input
//             type="text"
//             placeholder="Search by name or email"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//         />
//         <div className='table-wrapper'></div>
//         <table>
//             <thead>
//             <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Status</th>
//                 <th>Lead Source</th>
//                 <th>Created Date</th>
//             </tr>
//             </thead>
//             <tbody>
//             {filteredLeads.map((lead, index) => (
//                 <tr key = {lead.id}>
//                 <td>{lead.name}</td>
//                 <td>{lead.email}</td>
//                 <td>{lead.phone}</td>
//                 <td><span className = {getStatusClass(lead.status)}>{lead.status}</span></td>
//                 <td>{lead.leadSource}</td>
//                 <td>{lead.createdDate}</td>
//             </tr>
//             ))}
//             </tbody>
//         </table>
//         </div>
//     );
//     };
// export default LeadsTable;

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Calendar, Mail, Phone, User, Filter } from 'lucide-react';
import './LeadsTable.css';
import leadsData from '../data/leads.json';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'status-new';
      case 'In Progress':
        return 'status-progress';
      case 'Converted':
        return 'status-converted';
      default:
        return 'status-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const LeadsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  // Get unique statuses and sources for filter options
  const statuses = ['All', ...new Set(leadsData.map(lead => lead.status))];
  const sources = ['All', ...new Set(leadsData.map(lead => lead.leadSource))];

  // Filter and search logic
  const filteredLeads = useMemo(() => {
    return leadsData.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
      const matchesSource = filterSource === 'All' || lead.leadSource === filterSource;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [searchTerm, filterStatus, filterSource]);

  // Sorting logic
  const sortedLeads = useMemo(() => {
    if (!sortConfig.key) return filteredLeads;

    return [...filteredLeads].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date sorting
      if (sortConfig.key === 'createdDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredLeads, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = sortedLeads.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="sort-icon" /> : 
      <ChevronDown className="sort-icon" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setFilterSource('All');
    setCurrentPage(1);
    setSortConfig({ key: null, direction: 'asc' });
  };

  return (
    <div className="leads-container">
      <div className="leads-wrapper">
        {/* Header */}
        <div className="leads-header">
          <h1 className="leads-title">CRM Leads Dashboard</h1>
          <p className="leads-subtitle">Manage and track your sales leads effectively</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="controls-section">
          <div className="controls-row">
            {/* Search Bar */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filter Toggle and Reset */}
            <div className="controls-buttons">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="filter-toggle-btn"
              >
                <Filter className="btn-icon" />
                Filters
              </button>
              <button
                onClick={resetFilters}
                className="reset-btn"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="filters-section">
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Lead Source</label>
                  <select
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="filter-select"
                  >
                    {sources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p className="results-text">
            Showing {paginatedLeads.length} of {sortedLeads.length} leads
            {(searchTerm || filterStatus !== 'All' || filterSource !== 'All') && ' (filtered)'}
          </p>
        </div>

        {/* Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="leads-table">
              <thead className="table-header">
                <tr>
                  <th 
                    className="table-th sortable"
                    onClick={() => handleSort('name')}
                  >
                    <div className="th-content">
                      <User className="th-icon" />
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="table-th">
                    <div className="th-content">
                      <Mail className="th-icon" />
                      Email
                    </div>
                  </th>
                  <th className="table-th">
                    <div className="th-content">
                      <Phone className="th-icon" />
                      Phone
                    </div>
                  </th>
                  <th className="table-th">
                    Status
                  </th>
                  <th className="table-th">
                    Lead Source
                  </th>
                  <th 
                    className="table-th sortable"
                    onClick={() => handleSort('createdDate')}
                  >
                    <div className="th-content">
                      <Calendar className="th-icon" />
                      Created Date
                      {getSortIcon('createdDate')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="table-row">
                    <td className="table-td">
                      <div className="td-name">{lead.name}</div>
                    </td>
                    <td className="table-td">
                      <div className="td-text">{lead.email}</div>
                    </td>
                    <td className="table-td">
                      <div className="td-text">{lead.phone}</div>
                    </td>
                    <td className="table-td">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="table-td">
                      <div className="td-text">{lead.leadSource}</div>
                    </td>
                    <td className="table-td">
                      <div className="td-text">{formatDate(lead.createdDate)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedLeads.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Search className="empty-search-icon" />
              </div>
              <h3 className="empty-title">No leads found</h3>
              <p className="empty-text">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              <div className="pagination-buttons">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          {statuses.filter(s => s !== 'All').map(status => {
            const count = leadsData.filter(lead => lead.status === status).length;
            const percentage = ((count / leadsData.length) * 100).toFixed(1);
            return (
              <div key={status} className="stats-card">
                <div className="stats-content">
                  <div className="stats-info">
                    <p className="stats-label">{status}</p>
                    <p className="stats-count">{count}</p>
                  </div>
                  <div className="stats-badge">
                    <p className="stats-percentage">{percentage}%</p>
                    <StatusBadge status={status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeadsTable;