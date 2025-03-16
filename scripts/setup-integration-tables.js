const createIntegrationTables = `
-- Tabla para almacenar las credenciales de Mercado Pago
CREATE TABLE IF NOT EXISTS integration_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  access_token TEXT NOT NULL,
  public_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar el estado de la integración
CREATE TABLE IF NOT EXISTS integration_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connected BOOLEAN DEFAULT FALSE,
  access_token_valid BOOLEAN DEFAULT FALSE,
  public_key_valid BOOLEAN DEFAULT FALSE,
  webhook_configured BOOLEAN DEFAULT FALSE,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar variables de entorno (simulada)
CREATE TABLE IF NOT EXISTS environment_variables (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
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

-- Aplicar el trigger a las tablas
CREATE TRIGGER update_integration_credentials_updated_at
BEFORE UPDATE ON integration_credentials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_status_updated_at
BEFORE UPDATE ON integration_status
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_environment_variables_updated_at
BEFORE UPDATE ON environment_variables
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Configurar políticas de seguridad
ALTER TABLE integration_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment_variables ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios autenticados (administradores)
CREATE POLICY "Allow authenticated users to read integration_credentials" ON integration_credentials
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update integration_credentials" ON integration_credentials
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert integration_credentials" ON integration_credentials
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read integration_status" ON integration_status
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update integration_status" ON integration_status
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert integration_status" ON integration_status
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read environment_variables" ON environment_variables
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update environment_variables" ON environment_variables
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert environment_variables" ON environment_variables
FOR INSERT TO authenticated
WITH CHECK (true);
`;

console.log("SQL para crear las tablas de integración:");
console.log(createIntegrationTables);
