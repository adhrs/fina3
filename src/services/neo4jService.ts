import neo4j, { Driver, Session, Record } from 'neo4j-driver';
import { FamilyMember, Relationship } from '../types/FamilyTypes';

export class Neo4jService {
  private driver: Driver | null = null;
  private static instance: Neo4jService;
  private connectionRetries = 0;
  private maxRetries = 3;
  
  private constructor() {
    console.log('Neo4jService instance created');
  }

  public static getInstance(): Neo4jService {
    if (!Neo4jService.instance) {
      Neo4jService.instance = new Neo4jService();
    }
    return Neo4jService.instance;
  }

  async connect(uri: string, username: string, password: string): Promise<boolean> {
    try {
      if (this.driver) {
        await this.driver.close();
      }

      console.log('Connecting to Neo4j...', { uri });
      
      this.driver = neo4j.driver(
        uri,
        neo4j.auth.basic(username, password),
        { 
          maxConnectionLifetime: 3 * 60 * 60 * 1000,
          connectionTimeout: 30000,
        }
      );
      
      // Verify connection
      const session = this.driver.session();
      console.log('Testing connection...');
      await session.run('RETURN 1');
      await session.close();
      
      console.log('Successfully connected to Neo4j');
      this.connectionRetries = 0;
      return true;
    } catch (error) {
      console.error('Failed to connect to Neo4j:', error);
      
      if (this.connectionRetries < this.maxRetries) {
        this.connectionRetries++;
        console.log(`Retrying connection (attempt ${this.connectionRetries}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.connect(uri, username, password);
      }
      
      this.driver = null;
      return false;
    }
  }

  async getFamilyMembers(): Promise<FamilyMember[]> {
    if (!this.driver) {
      throw new Error('Database connection not established');
    }

    const session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (p:Person) RETURN p'
      );
      
      return result.records.map(record => {
        const node = record.get('p');
        return {
          id: node.properties.id,
          name: node.properties.name,
          birthDate: node.properties.birthDate,
          deathDate: node.properties.deathDate,
          imageUrl: node.properties.imageUrl,
          gender: node.properties.gender,
        };
      });
    } finally {
      await session.close();
    }
  }

  async getRelationships(): Promise<Relationship[]> {
    if (!this.driver) {
      throw new Error('Database connection not established');
    }

    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (p1:Person)-[r:PARENT|SPOUSE|CHILD]->(p2:Person)
         RETURN type(r) as type, r.id as id, p1.id as from, p2.id as to, r.marriageDate as marriageDate`
      );
      
      return result.records.map(record => ({
        id: record.get('id'),
        type: record.get('type').toLowerCase() as 'parent' | 'spouse' | 'child',
        from: record.get('from'),
        to: record.get('to'),
        marriageDate: record.get('marriageDate'),
      }));
    } finally {
      await session.close();
    }
  }

  async addFamilyMember(member: FamilyMember): Promise<void> {
    if (!this.driver) {
      throw new Error('Database connection not established');
    }

    const session = this.driver.session();
    try {
      await session.executeWrite(tx =>
        tx.run(
          `CREATE (p:Person {
            id: $id,
            name: $name,
            birthDate: $birthDate,
            deathDate: $deathDate,
            imageUrl: $imageUrl,
            gender: $gender
          })`,
          member
        )
      );
    } finally {
      await session.close();
    }
  }

  async addRelationship(relationship: Relationship): Promise<void> {
    if (!this.driver) {
      throw new Error('Database connection not established');
    }

    const session = this.driver.session();
    try {
      await session.executeWrite(tx =>
        tx.run(
          `MATCH (p1:Person {id: $from})
           MATCH (p2:Person {id: $to})
           CREATE (p1)-[r:${relationship.type.toUpperCase()} {
             id: $id,
             marriageDate: $marriageDate
           }]->(p2)`,
          relationship
        )
      );
    } finally {
      await session.close();
    }
  }

  async close(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
    }
  }
}