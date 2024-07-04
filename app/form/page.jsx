"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Layout from '../components/Layout';

const UploadMongoImage = () => {
    const [file, setFile] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [dateOfReleave, setDateOfReleave] = useState('');
    const [designation, setDesignation] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [reason, setReason] = useState('');
    const [employees, setEmployees] = useState([]);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [loading, setLoading] = useState(false);

    const formRef = useRef(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/contact');
            const data = await response.json();

            if (data.success) {
                setEmployees(data.images);
            } else {
                console.error('Failed to fetch employees:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('employeeId', employeeId);
        formData.append('employeeName', employeeName);
        formData.append('joinDate', joinDate);
        formData.append('dateOfReleave', dateOfReleave);
        formData.append('designation', designation);
        formData.append('email', email);
        formData.append('mobile', mobile);
        formData.append('reason', reason);

        setLoading(true);

        try {
            let response;
            if (editingEmployeeId) {
                formData.append('id', editingEmployeeId);
                response = await fetch(`/api/contact`, {
                    method: 'PUT',
                    body: formData,
                });
            } else {
                response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData,
                });
            }

            const result = await response.json();

            if (result.success) {
                alert('Operation Successful');
                fetchEmployees();
                clearForm();
            } else {
                alert('Operation Failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (employeeId) => {
        const employeeToEdit = employees.find((emp) => emp._id === employeeId);
        if (employeeToEdit) {
            setEditingEmployeeId(employeeId);
            setEmployeeId(employeeToEdit.employeeId);
            setEmployeeName(employeeToEdit.employeeName);
            setJoinDate(employeeToEdit.joinDate.split('T')[0]);
            setDateOfReleave(employeeToEdit.dateOfReleave.split('T')[0]);
            setDesignation(employeeToEdit.designation);
            setEmail(employeeToEdit.email);
            setMobile(employeeToEdit.mobile);
            setReason(employeeToEdit.reason);
            setFile(null);

            formRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('Employee not found for editing');
        }
    };

    const handleDelete = async (employeeId) => {
        try {
            const response = await fetch(`/api/contact?id=${employeeId}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.success) {
                alert('Successfully deleted');
                fetchEmployees();
            } else {
                console.error('Failed to delete:', result.error);
                alert('Failed to delete');
            }
        } catch (error) {
            console.error('An error occurred during deletion:', error);
            alert('An error occurred.');
        }
    };

    const clearForm = () => {
        setEditingEmployeeId(null);
        setEmployeeId('');
        setEmployeeName('');
        setJoinDate('');
        setDateOfReleave('');
        setDesignation('');
        setEmail('');
        setMobile('');
        setReason('');
        setFile(null);
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-4 transition duration-500 mb-5">
                    <h2 className="text-2xl font-bold mb-4">Employee Form</h2>
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <input type="text" placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <input type="text" placeholder="Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <input type="date" placeholder="Join Date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <input type="date" placeholder="Date of Re-leave" value={dateOfReleave} onChange={(e) => setDateOfReleave(e.target.value)} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <input type="text" placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <input type="text" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="block w-full bg-gray-100 border border-gray-300 p-2 rounded mb-2" />
                        <button type="submit" className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-500 w-full">
                            {editingEmployeeId ? 'Update' : 'Upload'}
                        </button>
                        {loading && (
                            <svg className="animate-spin h-5 w-5 ml-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.536v3.232C8.477 7.884 5.884 10.477 4.536 14H6zm6.535 0a7.962 7.962 0 01-1.501-2H9.016a9.968 9.968 0 002.149 2c-.022.254-.038.51-.038.768 0 1.437.414 2.778 1.125 3.932A7.963 7.963 0 0112.535 19V14h-.001zM19.464 14H18v3.536a8.001 8.001 0 01-3.755 6.768l1.262-2.748c.36-.784.557-1.646.557-2.56 0-.215-.017-.427-.04-.637a9.975 9.975 0 001.77-1.761c.03.005.059.008.09.013a8.002 8.002 0 013.82-5.041L19.464 14zM14 18.464A8.001 8.001 0 0110.464 22V18h3.536z"></path>
                            </svg>
                        )}
                    </form>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 transition duration-500">
                    <h2 className="text-2xl font-bold mb-4">Employee List</h2>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                        {employees.map((employee) => (
                            <div key={employee._id} className="bg-white shadow-md rounded-lg p-4 transition duration-500">
                                <p>Employee ID: {employee.employeeId}</p>
                                <p>Name: {employee.employeeName}</p>
                                <p>Email: {employee.email}</p>
                                <p>Mobile: {employee.mobile}</p>
                                <p>Join Date: {new Date(employee.joinDate).toLocaleDateString()}</p>
                                <p>Date of Re-leave: {new Date(employee.dateOfReleave).toLocaleDateString()}</p>
                                <p>Designation: {employee.designation}</p>
                                <p>Reason: {employee.reason}</p>
                                <Image
                                    src={`data:${employee.contentType};base64,${employee.data}`}
                                    alt={employee.name}
                                    width={200}
                                    height={200}
                                    className="rounded-lg"
                                />
                                <div className="mt-4">
                                    <button onClick={() => handleEdit(employee._id)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-500 mr-2">Edit</button>
                                    <button onClick={() => handleDelete(employee._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-500">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UploadMongoImage;
