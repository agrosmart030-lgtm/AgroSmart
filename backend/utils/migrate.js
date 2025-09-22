import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

// Tabela para controlar as migrações
const createMigrationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};

// Verifica se uma migração já foi executada
const isMigrationExecuted = async (migrationName) => {
  const result = await pool.query(
    'SELECT id FROM migrations WHERE name = $1',
    [migrationName]
  );
  return result.rows.length > 0;
};

// Marca uma migração como executada
const markMigrationAsExecuted = async (migrationName) => {
  await pool.query(
    'INSERT INTO migrations (name) VALUES ($1)',
    [migrationName]
  );
};

// Executa um arquivo de migração
const executeMigration = async (file) => {
  const migrationName = path.basename(file);
  
  // Verifica se a migração já foi executada
  if (await isMigrationExecuted(migrationName)) {
    console.log(`✅ Migração já executada: ${migrationName}`);
    return;
  }

  try {
    // Lê o conteúdo do arquivo SQL
    const sql = fs.readFileSync(file, 'utf8');
    
    // Inicia uma transação
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Executa o script SQL
      await client.query(sql);
      
      // Marca a migração como executada
      await client.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [migrationName]
      );
      
      await client.query('COMMIT');
      console.log(`✅ Migração aplicada com sucesso: ${migrationName}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Erro ao executar migração ${migrationName}:`, error.message);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`❌ Erro ao ler o arquivo de migração ${migrationName}:`, error.message);
    throw error;
  }
};

// Executa todas as migrações pendentes
export const runMigrations = async () => {
  try {
    // Cria a tabela de migrações se não existir
    await createMigrationsTable();
    
    // Lista todos os arquivos de migração
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ordena por nome para garantir a ordem correta
    
    console.log(`🔍 Encontradas ${files.length} migrações`);
    
    // Executa cada migração
    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      await executeMigration(filePath);
    }
    
    console.log('✨ Todas as migrações foram aplicadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  }
};

// Se executado diretamente (não como módulo)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => {
      console.log('Migração concluída!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Falha na migração:', error);
      process.exit(1);
    });
}
