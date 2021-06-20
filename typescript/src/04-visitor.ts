// Hide from the implementation details of how you store everything 
// and just give you a traversal method


import { BaseRecord, Pokemon } from ".";
import { AfterSetEvent, BeforeSetEvent, createObserver, Listener, ObserverDatabase } from "./03-observer";

export interface VisitorDatabase<T extends BaseRecord> extends ObserverDatabase<T> {
  visit(visitor: (item: T) => void): void;
}

// Factory Pattern
export function createDatabse<T extends BaseRecord>() {
  class InMemoryDatabase implements VisitorDatabase<T>{
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();

    private beforeAddListerners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

    private constructor() { }

    public set(newValue: T): void {
      this.beforeAddListerners.publish({
        newValue,
        value: this.db[newValue.id]
      });

      this.db[newValue.id] = newValue;

      this.afterAddListeners.publish({
        value: newValue
      });
    }

    public get(id: string): T | null {
      return this.db[id];
    }

    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
      return this.beforeAddListerners.subscribe(listener);
    }

    onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener);
    }

    // Visitor pattern
    visit(visitor: (item:T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

  }

  // Singleton Pattern
  // return new InMemoryDatabase();
  return InMemoryDatabase;
}

// const PokemonDB = createDatabse<Pokemon>();

// const unsubscribe = PokemonDB.instance.onAfterAdd(({ value }) => {
//   console.log({ value });
// });

// PokemonDB.instance.set({
//   id: "Armadillo",
//   defense: 80,
//   attack: 60
// });

// unsubscribe();

// PokemonDB.instance.set({
//   id: "TRex",
//   defense: 30,
//   attack: 90
// });

// // implementing visitor
// PokemonDB.instance.visit((item) => {
//   console.log({ item });
// });