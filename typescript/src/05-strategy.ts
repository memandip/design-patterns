import { BaseRecord, Pokemon } from ".";
import { AfterSetEvent, BeforeSetEvent, createObserver, Listener } from "./03-observer";
import { VisitorDatabase } from "./04-visitor";

interface StrategyDatabase<T extends BaseRecord> extends VisitorDatabase<T> {
  selectBest(scoreStrategyL: (item: T) => number): T | undefined;
}

// Factory Pattern
export function createDatabse<T extends BaseRecord>() {
  class InMemoryDatabase implements StrategyDatabase<T>{
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
    visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

    // Strategy
    selectBest(scoreStrategy: (item: T) => number): T | undefined {
      const found: {
        max: number;
        item: T | undefined
      } = {
        max: 0,
        item: undefined
      };

      Object.values(this.db).reduce((f, item) => {
        const score = scoreStrategy(item);
        if (score > f.max) {
          f.max = score;
          f.item = item;
        }

        return f;
      }, found)

      return found.item;
    }

  }

  // Singleton Pattern
  // return new InMemoryDatabase();
  return InMemoryDatabase;
}

const PokemonDB = createDatabse<Pokemon>();

// PokemonDB.instance.set({
//   id: "Armadillo",
//   defense: 80,
//   attack: 60
// });

// PokemonDB.instance.set({
//   id: "TRex",
//   defense: 30,
//   attack: 90
// });

// // implement strategy
// const bestDefensive = PokemonDB.instance.selectBest(({ defense }) => defense);
// const bestAttack = PokemonDB.instance.selectBest(({ attack }) => attack);

// console.log({ bestDefensive });
// console.log({ bestAttack });