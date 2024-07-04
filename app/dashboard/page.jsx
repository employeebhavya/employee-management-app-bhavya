"use client";

import { useEffect, useState } from "react";
import Layout from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/dashboard');
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                    setTotalEmployees(result.totalEmployees);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Employee Statistics</h2>
                <div className="overflow-x-auto">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                    <p className="mb-2">Total Employees: {totalEmployees}</p>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
