-- COMPLETE DATABASE FIX FOR GUEST MODE (SAFE VERSION)
-- Run this in your Supabase SQL Editor

-- Step 1: Create guest user in auth.users table (if it doesn't exist)
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
  is_super_admin
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
  false
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Make created_by nullable in documents table (safer approach)
ALTER TABLE public.documents ALTER COLUMN created_by DROP NOT NULL;

-- Step 3: Make created_by nullable in document_chunks table  
ALTER TABLE public.document_chunks ALTER COLUMN created_by DROP NOT NULL;

-- Step 4: Drop ALL existing policies (comprehensive cleanup)

-- Documents table policies
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON "public"."documents";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."documents";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."documents";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "public"."documents";
DROP POLICY IF EXISTS "Enable read for all users" ON "public"."documents";
DROP POLICY IF EXISTS "Enable insert for all users" ON "public"."documents";
DROP POLICY IF EXISTS "Enable delete for all users" ON "public"."documents";
DROP POLICY IF EXISTS "Enable update for all users" ON "public"."documents";

-- Chat records table policies
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON "public"."chat_records";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."chat_records";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."chat_records";
DROP POLICY IF EXISTS "Enable read for all users" ON "public"."chat_records";
DROP POLICY IF EXISTS "Enable insert for all users" ON "public"."chat_records";
DROP POLICY IF EXISTS "Enable delete for all users" ON "public"."chat_records";

-- Document chunks table policies
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON "public"."document_chunks";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."document_chunks";
DROP POLICY IF EXISTS "Enable read for all users" ON "public"."document_chunks";
DROP POLICY IF EXISTS "Enable insert for all users" ON "public"."document_chunks";

-- Storage policies
DROP POLICY IF EXISTS "Enable all for authenticated users only" ON "storage"."buckets";
DROP POLICY IF EXISTS "Enable all for authenticated users only" ON "storage"."objects";
DROP POLICY IF EXISTS "Enable all for public users" ON "storage"."buckets";
DROP POLICY IF EXISTS "Enable all for public users" ON "storage"."objects";

-- Step 5: Create new guest-friendly policies with unique names

-- Documents table
CREATE POLICY "guest_mode_read_documents" ON "public"."documents" 
AS PERMISSIVE FOR SELECT TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid) OR
  (created_by IS NULL)
);

CREATE POLICY "guest_mode_insert_documents" ON "public"."documents" 
AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "guest_mode_delete_documents" ON "public"."documents" 
AS PERMISSIVE FOR DELETE TO public USING (true);

CREATE POLICY "guest_mode_update_documents" ON "public"."documents" 
AS PERMISSIVE FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Chat records table
CREATE POLICY "guest_mode_read_chat_records" ON "public"."chat_records" 
AS PERMISSIVE FOR SELECT TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid) OR
  (created_by IS NULL)
);

CREATE POLICY "guest_mode_insert_chat_records" ON "public"."chat_records" 
AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "guest_mode_delete_chat_records" ON "public"."chat_records" 
AS PERMISSIVE FOR DELETE TO public USING (true);

-- Document chunks table
CREATE POLICY "guest_mode_read_document_chunks" ON "public"."document_chunks" 
AS PERMISSIVE FOR SELECT TO public USING (
  (auth.uid() = created_by) OR 
  (created_by = '00000000-0000-0000-0000-000000000000'::uuid) OR
  (created_by IS NULL)
);

CREATE POLICY "guest_mode_insert_document_chunks" ON "public"."document_chunks" 
AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

-- Storage policies
CREATE POLICY "guest_mode_storage_buckets" ON "storage"."buckets" 
AS PERMISSIVE FOR ALL TO public USING (true);

CREATE POLICY "guest_mode_storage_objects" ON "storage"."objects" 
AS PERMISSIVE FOR ALL TO public USING (true);

-- Step 5: Create helpful views for guest mode
CREATE OR REPLACE VIEW guest_documents AS 
SELECT 
  checksum,
  document_name,
  title,
  created_time,
  CASE 
    WHEN created_by IS NULL THEN 'guest'
    WHEN created_by = '00000000-0000-0000-0000-000000000000'::uuid THEN 'guest'
    ELSE 'user'
  END as user_type
FROM public.documents;

-- Grant access to the view
GRANT SELECT ON guest_documents TO public;