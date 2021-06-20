import { BaseRecord, Database, Pokemon } from ".";

// Factory Pattern
function createDatabse<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T>{
    private db: Record<string, T> = {};

    public set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }

    public get(id: string): T | null {
      return this.db[id];
    }
  }

  return InMemoryDatabase;
}

// const PokemonDb = createDatabse<Pokemon>();
// const pokemonDB = new PokemonDb();

// pokemonDB.set({
//   id: "TRex",
//   attack: 80,
//   defense: 80
// });

// console.log({ pokemonDB: pokemonDB.get("TRex1") });