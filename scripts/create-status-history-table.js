const createStatusHistoryTable = `
-- Crear tabla para el historial de estados
CREATE TABLE donation_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES donations(id),
  previous_status TEXT,
  new_status TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas eficientes
CREATE INDEX idx_donation_status_history_donation_id ON donation_status_history(donation_id);
`

console.log("SQL para crear la tabla de historial de estados:")
console.log(createStatusHistoryTable)

