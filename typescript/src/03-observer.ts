import { BaseRecord, Database, Pokemon } from ".";

// Observer Pattern
export type Listener<EventType> = (ev: EventType) => void;

export interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

export interface AfterSetEvent<T> {
  value: T;
}

export interface ObserverDatabase<T extends BaseRecord> extends Database<T> {
  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;
}

export function createObserver<EventType>(): {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
} {
  let listeners: Listener<EventType>[] = [];

  return {
    subscribe: (listener: Listener<EventType>): () => void => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },
    publish: (event: EventType) => {
      listeners.forEach((l: Listener<EventType>) => l(event));
    }
  };
}

// Factory Pattern
export function createDatabse<T extends BaseRecord>() {
  class InMemoryDatabase implements ObserverDatabase<T>{
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