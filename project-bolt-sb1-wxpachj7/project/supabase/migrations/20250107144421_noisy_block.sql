/*
  # Initial Schema for Parking Management System

  1. New Tables
    - vehicles
      - id (uuid, primary key) 
      - license_plate (text)
      - type (text)
      - entry_time (timestamptz)
      - exit_time (timestamptz)
      - duration (interval)
      - space_id (uuid, foreign key)
      
    - parking_spaces
      - id (uuid, primary key)
      - zone (text)
      - status (text)
      - type (text)
      
    - staff
      - id (uuid, primary key)
      - name (text)
      - username (text)
      - admin_id (uuid, foreign key)
      
    - admins
      - id (uuid, primary key)
      - name (text)
      - username (text)
      
    - features
      - id (uuid, primary key)
      - staff_id (uuid, foreign key)
      - space_id (uuid, foreign key)
      - description (text)
      - status (text)
      
    - logs
      - id (uuid, primary key)
      - vehicle_id (uuid, foreign key)
      - space_id (uuid, foreign key)
      - staff_id (uuid, foreign key)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - total_duration (interval)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  admin_id uuid REFERENCES admins(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE parking_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone text NOT NULL,
  status text NOT NULL DEFAULT 'available',
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate text UNIQUE NOT NULL,
  type text NOT NULL,
  entry_time timestamptz DEFAULT now(),
  exit_time timestamptz,
  duration interval,
  space_id uuid REFERENCES parking_spaces(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES staff(id),
  space_id uuid REFERENCES parking_spaces(id),
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  space_id uuid REFERENCES parking_spaces(id),
  staff_id uuid REFERENCES staff(id),
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  total_duration interval,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read access" ON admins
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON staff
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON parking_spaces
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON vehicles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON features
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON logs
  FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_vehicles_space ON vehicles(space_id);
CREATE INDEX idx_features_space ON features(space_id);
CREATE INDEX idx_logs_vehicle ON logs(vehicle_id);
CREATE INDEX idx_logs_space ON logs(space_id);