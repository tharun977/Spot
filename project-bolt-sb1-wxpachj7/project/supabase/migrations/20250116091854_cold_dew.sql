/*
  # Add initial admin and user

  1. Data Insertion
    - Add an admin user with email admin@admin.spot
    - Add a regular user with email user@spot.com
*/

-- Insert admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ad3e1dbb-48f5-4e6c-9c5b-d7a6d2fc123a',
  'authenticated',
  'authenticated',
  'admin@admin.spot',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  ''
);

-- Insert regular user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b4f1d2cc-59e6-4f7d-8c3a-e5b2d9fc456b',
  'authenticated',
  'authenticated',
  'user@spot.com',
  crypt('user123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  ''
);

-- Insert admin record
INSERT INTO admins (
  id,
  name,
  username
) VALUES (
  'ad3e1dbb-48f5-4e6c-9c5b-d7a6d2fc123a',
  'Admin User',
  'admin'
);