const createRetryQueueTable = `
-- Crear tabla para la cola de reintentos
CREATE TABLE webhook_retry_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id TEXT NOT NULL,
  external_reference TEXT NOT NULL,
  status TEXT NOT NULL,
  attempt INT NOT NULL,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_retry_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

-- Crear índice para búsquedas eficientes
CREATE INDEX idx_webhook_retry_queue_next_retry ON webhook_retry_queue(next_retry_at) 
WHERE processed = FALSE;
`

console.log("SQL para crear la tabla de cola de reintentos:")
console.log(createRetryQueueTable)

