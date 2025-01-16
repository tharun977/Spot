import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Vehicle {
  id: string;
  license_plate: string;
  type: string;
  entry_time: string;
  exit_time: string | null;
  space_id: string | null;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [spaceId, setSpaceId] = useState('');
  const [spaces, setSpaces] = useState<any[]>([]);

  useEffect(() => {
    fetchVehicles();
    fetchSpaces();
  }, []);

  async function fetchVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('entry_time', { ascending: false });
    
    if (error) {
      console.error('Error fetching vehicles:', error);
    } else {
      setVehicles(data);
    }
  }

  async function fetchSpaces() {
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('*')
      .eq('status', 'available');
    
    if (error) {
      console.error('Error fetching spaces:', error);
    } else {
      setSpaces(data);
    }
  }

  async function addVehicle(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('vehicles').insert([
      {
        license_plate: licensePlate,
        type: vehicleType,
        space_id: spaceId || null,
      },
    ]);

    if (error) {
      console.error('Error adding vehicle:', error);
    } else {
      setShowModal(false);
      setLicensePlate('');
      setVehicleType('car');
      setSpaceId('');
      fetchVehicles();
    }
  }

  async function checkoutVehicle(id: string) {
    const { error } = await supabase
      .from('vehicles')
      .update({ exit_time: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error checking out vehicle:', error);
    } else {
      fetchVehicles();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Vehicles</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License Plate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entry Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vehicle.license_plate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(vehicle.entry_time).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vehicle.exit_time ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {vehicle.exit_time ? 'Checked Out' : 'Parked'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {!vehicle.exit_time && (
                    <button
                      onClick={() => checkoutVehicle(vehicle.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Vehicle</h2>
            <form onSubmit={addVehicle}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Plate</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parking Space</label>
                  <select
                    value={spaceId}
                    onChange={(e) => setSpaceId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select a space</option>
                    {spaces.map((space) => (
                      <option key={space.id} value={space.id}>
                        Zone {space.zone} - {space.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}