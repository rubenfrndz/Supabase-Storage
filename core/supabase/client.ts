import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gkrcnndkjkqhzxpwszsd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrcmNubmRramtxaHp4cHdzenNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MDk4MzksImV4cCI6MjA0ODQ4NTgzOX0.T4CayqNtMgbvjs3GktFHPupObOiF24kyTNzq7h3QW3A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Prueba de conexión
export const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('*').limit(1);
      if (error) {
        console.error('Error al conectar con Supabase:', error);
      } else {
        console.log('Conexión exitosa. Datos:', data);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
    }
  };