import { BaseRecord, Database, Pokemon } from ".";

// Factory Pattern
function createDatabse<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T>{
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();

    private constructor() { }

    public set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }

    public get(id: string): T | null {
      return this.db[id];
    }
  }

  // Singleton Pattern
  // return new InMemoryDatabase();
  return InMemoryDatabase;
}

// const PokemonDB = createDatabse<Pokemon>();

// PokemonDB.instance.set({
//   id: "TRex",
//   attack: 80,
//   defense: 80
// });

// console.log({ pokemonDB: PokemonDB.instance.get("TRex1") });