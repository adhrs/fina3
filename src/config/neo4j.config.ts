const env = import.meta.env;

export const neo4jConfig = {
  uri: env.VITE_NEO4J_URI || 'bolt://localhost:7687',
  username: env.VITE_NEO4J_USERNAME || 'neo4j',
  password: env.VITE_NEO4J_PASSWORD || 'neo4j'
};