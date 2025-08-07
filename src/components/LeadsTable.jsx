import React, { useState, useEffect } from 'react';
import "./LeadsTable.css";
import LeadsData from "../data/leads.json";

const LeadsTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredLeads, setFilteredLeads] = useState(LeadsData);
    
    
    useEffect(() => {
        // Simulating data fetch
        const filtered = LeadsData.filter(lead =>
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLeads(filtered);
    },[searchTerm]);
        
const getStatusClass = (status) => {
    if (status === 'New') return 'badge-new';
    if (status === 'In Progress') return 'badge-in-progress';
    if (status === 'Converted') return 'badge-converted';
};
    
    return (
        <div className="table-container">
        <h2>CRM Leads</h2>
        <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
        />
        <div className='table-wrapper'></div>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Lead Source</th>
                <th>Created Date</th>
            </tr>
            </thead>
            <tbody>
            {filteredLeads.map((lead, index) => (
                <tr key = {lead.id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td><span className = {getStatusClass(lead.status)}>{lead.status}</span></td>
                <td>{lead.leadSource}</td>
                <td>{lead.createdDate}</td>
            </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };
export default LeadsTable;