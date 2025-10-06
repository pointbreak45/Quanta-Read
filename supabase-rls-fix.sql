-- IMPORTANT: Run this in your Supabase SQL Editor to fix RLS policies for guest mode

-- 0. First, create the guest user in auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'guest@localhost',
  '$2a$10$0000000000000000000000000000000000000000000000000000',
  now(),
  now(),
  now(),
  '{"provider": "guest", "providers": ["guest"]}',
  '{"display_name": "Guest User"}',
  false,
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create the guest user profile in public.profiles if it exists
-- (This may fail if you don't have a profiles table, which is fine)
INSERT INTO public.profiles (
  id,
  email,
  display_name,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'guest@localhost',
  'Guest User',
  now()
) ON CONFLICT (id) DO NOTHING;

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON "public"."documents";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."documents";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."documents";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "public"."documents";

DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON "public"."chat_records";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."chat_records";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."chat_records";

DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON "public"."document_chunks";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."document_chunks";

DROP POLICY IF EXISTS "Enable all for authenticated users only" ON "storage"."buckets";
DROP POLICY IF EXISTS "Enable all for authenticated users only" ON "storage"."objects";

-- 2. Create new policies that support guest mode (UUID: 00000000-0000-0000-0000-000000000000)

-- Documents table policies
CREATE POLICY "Enable read for all users" ON "public"."documents" 
AS PERMISSIVE FOR SELECT TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

CREATE POLICY "Enable insert for all users" ON "public"."documents" 
AS PERMISSIVE FOR INSERT TO public WITH CHECK (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

CREATE POLICY "Enable delete for all users" ON "public"."documents" 
AS PERMISSIVE FOR DELETE TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

CREATE POLICY "Enable update for all users" ON "public"."documents" 
AS PERMISSIVE FOR UPDATE TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
) WITH CHECK (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- Chat records table policies
CREATE POLICY "Enable read for all users" ON "public"."chat_records" 
AS PERMISSIVE FOR SELECT TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

CREATE POLICY "Enable insert for all users" ON "public"."chat_records" 
AS PERMISSIVE FOR INSERT TO public WITH CHECK (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

CREATE POLICY "Enable delete for all users" ON "public"."chat_records" 
AS PERMISSIVE FOR DELETE TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- Document chunks table policies
CREATE POLICY "Enable read for all users" ON "public"."document_chunks" 
AS PERMISSIVE FOR SELECT TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

CREATE POLICY "Enable insert for all users" ON "public"."document_chunks" 
AS PERMISSIVE FOR INSERT TO public WITH CHECK (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- Storage policies for guest access
CREATE POLICY "Enable all for public users" ON "storage"."buckets" 
AS PERMISSIVE FOR ALL TO public USING (true);

CREATE POLICY "Enable all for public users" ON "storage"."objects" 
AS PERMISSIVE FOR ALL TO public USING (true);