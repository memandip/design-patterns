import * as fs from "fs";
import { Pokemon } from ".";
import { createDatabse } from "./05-strategy";

export interface RecordHandler<T> {
  addRecord(record: T): void;
}

export function loader<T>(
  fileName: string,
  recordHandler: RecordHandler<T>
): void {
  const data: T[] = JSON.parse(fs.readFileSync(fileName).toString());

  data.forEach((record) => recordHandler.addRecord(record));
}

const PokemonDB = createDatabse<Pokemon>();

// Adapter pattern
// using used while connecting one library to another or so
class PokemonDBAdatpter implements RecordHandler<Pokemon>{
  addRecord(record: Pokemon) {
    PokemonDB.instance.set(record);
  }
}

const unsubscribe = PokemonDB.instance.onAfterAdd(({ value }) => {
  console.log({ value });
});

loader("./data.json", new PokemonDBAdatpter());

