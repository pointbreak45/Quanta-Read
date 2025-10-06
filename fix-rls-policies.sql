-- Fix RLS policies to support guest mode
-- Drop existing policies that only allow authenticated users
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

-- Create new policies that support both authenticated users and guest mode
-- Documents table policies
CREATE POLICY "Enable read access for all users" ON "public"."documents" 
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
CREATE POLICY "Enable read access for all users" ON "public"."chat_records" 
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
CREATE POLICY "Enable read access for all users" ON "public"."document_chunks" 
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