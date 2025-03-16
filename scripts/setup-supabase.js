const createDonationsTable = `
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount DECIMAL NOT NULL,
  username TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  audio_url TEXT,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear un trigger para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
`;

// 2. Configurar políticas de seguridad para la tabla de donaciones
const setupDonationsPolicies = `
-- Permitir inserción anónima (para crear donaciones sin autenticación)
CREATE POLICY "Allow anonymous inserts on donations" ON donations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Permitir lectura anónima solo de donaciones aprobadas y no anónimas
CREATE POLICY "Allow anonymous reads of approved non-anonymous donations" ON donations
  FOR SELECT TO anon
  USING (payment_status = 'approved' AND is_anonymous = false);

-- Permitir lectura completa para usuarios autenticados (administradores)
CREATE POLICY "Allow authenticated users to read all donations" ON donations
  FOR SELECT TO authenticated
  USING (true);

-- Permitir actualización solo para usuarios autenticados
CREATE POLICY "Allow authenticated users to update donations" ON donations
  FOR UPDATE TO authenticated
  USING (true);
`;

// 3. Configurar el bucket de almacenamiento para archivos de audio
const setupStorageBucket = `
-- Crear un bucket para archivos de audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-messages', 'audio-messages', true);

-- Permitir subida anónima de archivos
CREATE POLICY "Allow anonymous uploads to audio-messages" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'audio-messages');

-- Permitir lectura pública de archivos
CREATE POLICY "Allow public read access to audio-messages" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'audio-messages');
`;

console.log("Instrucciones para configurar Supabase:");
console.log("\n1. Crear la tabla de donaciones:");
console.log(createDonationsTable);
console.log("\n2. Configurar políticas de seguridad para la tabla de donaciones:");
console.log(setupDonationsPolicies);
console.log("\n3. Configurar el bucket de almacenamiento para archivos de audio:");
console.log(setupStorageBucket);
console.log(
  "\nEjecuta estos comandos en la interfaz SQL de Supabase o adaptalos según sea necesario.",
);
