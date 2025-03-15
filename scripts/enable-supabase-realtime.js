const enableRealtimeForDonations = `
-- Habilitar Realtime para la tabla de donaciones
BEGIN;
  -- Asegurarse de que la extensión pg_net esté instalada (necesaria para Realtime)
  CREATE EXTENSION IF NOT EXISTS pg_net;

  -- Habilitar la publicación para la tabla de donaciones
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE donations;
COMMIT;
`

console.log("SQL para habilitar Realtime en la tabla de donaciones:")
console.log(enableRealtimeForDonations)

