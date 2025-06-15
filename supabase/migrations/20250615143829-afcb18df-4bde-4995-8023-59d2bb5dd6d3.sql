
-- Pastikan admin dapat membuat dan menghapus user menggunakan panel admin.
-- Berikut langkahnya:

-- 1. Tambahkan enum tipe role, hanya jika belum ada.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'counselor', 'student');
  END IF;
END
$$ LANGUAGE plpgsql;

-- 2. Tabel user_roles untuk relasi user & role (jangan simpan role di profile saja!)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Function untuk cek role user
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- 5. Policy: hanya admin bisa insert/delete user_roles
CREATE POLICY "Admin dapat atur semua user_roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
  );

-- 6. Policy: hanya admin bisa delete user di profiles
CREATE POLICY "Hanya admin bisa hapus user profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
  );

-- 7. Policy: hanya admin bisa insert ke profiles (hanya jika ingin restrictable dari panel admin)
CREATE POLICY "Hanya admin bisa add user profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
  );

-- 8. Policy: hanya admin bisa hapus user di auth.users via API masih harus edge function/service key (tidak bisa langsung via client).
-- 9. Pastikan Anda mengatur service_role key di Supabase project untuk digunakan di edge function nanti.
