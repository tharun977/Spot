import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PlusCircle } from 'lucide-react';

interface SpaceData {
  zone: string;
  count: number;
  type: 'car' | 'motorcycle' | 'truck';
}

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spaceData, setSpaceData] = useState<SpaceData[]>([]);

  useEffect(() => {
    checkAdminStatus();
    fetchSpaceData();
  }, []);

  async function checkAdminStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: admin } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();
      setIsAdmin(!!admin);
    }
    setLoading(false);
  }

  async function fetchSpaceData() {
    const { data } = await supabase
      .from('parking_spaces')
      .select('zone, type')
      .order('zone');
    
    if (data) {
      const summary = data.reduce((acc: SpaceData[], space) => {
        const existing = acc.find(s => s.zone === space.zone && s.type === space.type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ zone: space.zone, type: space.type, count: 1 });
        }
        return acc;
      }, []);
      setSpaceData(summary);
    }
  }

  async function addParkingSpaces() {
    const zones = ['A', 'B', 'C'];
    const types = ['car', 'motorcycle', 'truck'];
    const spaces = [];

    for (const zone of zones) {
      for (const type of types) {
        // Add 10 car spaces, 5 motorcycle spaces, and 3 truck spaces per zone
        const count = type === 'car' ? 10 : type === 'motorcycle' ? 5 : 3;
        for (let i = 0; i < count; i++) {
          spaces.push({
            zone,
            type,
            status: 'available'
          });
        }
      }
    }

    const { error } = await supabase
      .from('parking_spaces')
      .insert(spaces);

    if (!error) {
      fetchSpaceData();
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {isAdmin && (
          <button
            onClick={addParkingSpaces}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Initialize Parking Spaces
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spaceData.map(({ zone, type, count }) => (
          <div key={`${zone}-${type}`} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Zone {zone} - {type}</h3>
            <p className="text-gray-600">Total Spaces: {count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}