import React from "react";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="text-lg text-gray-700">
                You can manage pets, appointments, health records, and more from here.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-4 shadow-md rounded-xl">
                    <h2 className="text-xl font-semibold">Adoption Requests</h2>
                    <p className="text-gray-600">View and manage requests</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded-xl">
                    <h2 className="text-xl font-semibold">Pet Listings</h2>
                    <p className="text-gray-600">Add, edit, and view pets</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded-xl">
                    <h2 className="text-xl font-semibold">Appointments</h2>
                    <p className="text-gray-600">Schedule health visits</p>
                </div>
            </div>
        </div>
    );
}
