export interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

export interface BaseRecord {
  id: string;
}

export interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | null;
}

// class InMemoryDatabase<T extends BaseRecord> implements Database<T>{

//   private db: Record<string, T> = {};

//   public set(newValue: T): void {
//     this.db[newValue.id] = newValue;
//   }

//   public get(id: string): T | null {
//     return this.db[id];
//   }

// }

// const pokemonDB = new InMemoryDatabase<Pokemon>();
// pokemonDB.set({
//   id: "TRex",
//   attack: 80,
//   defense: 80
// });

// console.log({ pokemonDB: pokemonDB.get("TRex1") });