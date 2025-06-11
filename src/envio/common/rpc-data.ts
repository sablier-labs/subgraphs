import * as path from "node:path";
import * as fs from "fs-extra";
import _ from "lodash";
import { sablier } from "sablier";
import type { Envio } from "./bindings";
import type { RPCData } from "./types";

type ShapeMap = {
  [RPCData.Category.ERC20]: Record<Envio.Address, RPCData.ERC20Metadata>;
  [RPCData.Category.Proxender]: Record<Envio.Address, RPCData.ProxenderInfo>;
};

export function initDataEntry<C extends RPCData.Category>(category: C, chainId: number): DataEntry<C> {
  return new DataEntry(category, chainId);
}

export class DataEntry<C extends RPCData.Category> {
  public readonly file: string;

  private static readonly BASE_DIR = path.join(__dirname, "rpc-data");
  private static readonly ENCODING = "utf8" as const;

  private data: ShapeMap[C] = {};

  constructor(
    public readonly category: C,
    public readonly chainId: number,
  ) {
    const chain = sablier.chains.getOrThrow(chainId);
    this.file = path.join(DataEntry.BASE_DIR, category, `${chain.slug}.json`);
    this.preflight();
    this.load();
  }

  private load(): void {
    try {
      const raw = fs.readFileSync(this.file, DataEntry.ENCODING);
      this.data = JSON.parse(raw);
    } catch (err) {
      console.error(`Failed reading data from ${this.file}`, err);
      this.data = {};
    }
  }

  private preflight() {
    const fileExists = fs.existsSync(this.file);
    if (!fileExists) {
      fs.writeFileSync(this.file, "{}", DataEntry.ENCODING);
    }
  }

  public read<K extends keyof ShapeMap[C]>(key: K): ShapeMap[C][K] | undefined {
    return this.data[key];
  }

  public write(newData: Partial<ShapeMap[C]>): void {
    // Data is only written in the development environment.
    const ENVIO_ENVIRONMENT = process.env.ENVIO_ENVIRONMENT;
    if (ENVIO_ENVIRONMENT !== "development") {
      return;
    }
    this.data = _.merge({}, this.data, newData);
    try {
      fs.writeFileSync(this.file, JSON.stringify(this.data), DataEntry.ENCODING);
    } catch (err) {
      console.error(`Failed writing data to ${this.file}`, err);
    }
  }
}
