import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = {
  user: process.env.PGUSER || 'postgres', // usuário do PostgreSQL
  host: process.env.PGHOST || 'localhost', // endereço do servidor
  database: process.env.PGDATABASE || 'agrosmart', // nome do banco de dados
  password: process.env.PGPASSWORD || 'postgres', // senha do PostgreSQL
  port: process.env.PGPORT || 5432, // porta do PostgreSQL
  ssl: isProduction ? { rejectUnauthorized: false } : false,
};

// Cria uma nova pool de conexões
const pool = new Pool(poolConfig);

// Testa a conexão com o banco de dados
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    return false;
  }
};

export { pool, testConnection };
