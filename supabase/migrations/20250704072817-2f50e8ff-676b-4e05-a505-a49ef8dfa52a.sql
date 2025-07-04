-- Create super admin user profile
INSERT INTO public.profiles (id, username, full_name, role) 
VALUES (
  'e3b6c4d5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',  -- placeholder ID that will be updated
  'andikabgs@gmail.com',
  'Super Admin',
  'admin'
) ON CONFLICT (username) DO UPDATE SET 
  role = 'admin',
  full_name = 'Super Admin';

-- Add user role for super admin
INSERT INTO public.user_roles (user_id, role)
VALUES (
  'e3b6c4d5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',  -- placeholder ID
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;