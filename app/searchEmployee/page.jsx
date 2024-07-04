"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

const SearchPage = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [employeeData, setEmployeeData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!employeeId) {
            setError("Please enter an Employee ID");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/search?employeeId=${employeeId}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();

            if (result.success) {
                setEmployeeData(result.image);
                setError("");
            } else {
                setEmployeeData(null);
                setError(result.error);
            }
        } catch (err) {
            setEmployeeData(null);
            setError("An error occurred while searching");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Search Employee</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Enter Employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className={`bg-blue-500 text-white p-3 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 mx-auto text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {employeeData && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2">Employee Details</h2>
                        <div className="border border-gray-300 p-4 rounded">
                            <p className="mb-2"><strong>ID:</strong> {employeeData.employeeId}</p>
                            <p className="mb-2"><strong>Name:</strong> {employeeData.employeeName}</p>
                            <p className="mb-2"><strong>Join Date:</strong> {new Date(employeeData.joinDate).toLocaleDateString()}</p>
                            <p className="mb-2"><strong>Date of Releave:</strong> {new Date(employeeData.dateOfReleave).toLocaleDateString()}</p>
                            <p className="mb-2"><strong>Designation:</strong> {employeeData.designation}</p>
                            <p className="mb-2"><strong>Email:</strong> {employeeData.email}</p>
                            <p className="mb-2"><strong>Mobile:</strong> {employeeData.mobile}</p>
                            <p className="mb-2"><strong>Reason:</strong> {employeeData.reason}</p>
                            <img
                                src={`data:${employeeData.contentType};base64,${employeeData.data}`}
                                alt={employeeData.name}
                                className="mt-4 rounded-lg"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
