const updateDonationsTable = `
-- Añadir campo external_reference a la tabla donations
ALTER TABLE donations ADD COLUMN IF NOT EXISTS external_reference TEXT;

-- Crear un índice para búsquedas rápidas por external_reference
CREATE INDEX IF NOT EXISTS idx_donations_external_reference ON donations(external_reference);
`;

console.log("SQL para actualizar el esquema de la tabla donations:");
console.log(updateDonationsTable);
