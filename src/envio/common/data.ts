import * as path from "node:path";
import { getChain } from "@sablier/deployments";
import * as fs from "fs-extra";
import _ from "lodash";
import type { Address } from "./bindings";
import type { ERC20Metadata } from "./types";

export enum DataCategory {
  Asset = "assets",
  Proxy = "proxies",
}

type ProxyInfo = {
  owner?: Address;
};

type ShapeMap = {
  [DataCategory.Asset]: Record<Address, ERC20Metadata>;
  [DataCategory.Proxy]: Record<Address, ProxyInfo>;
};

export function initDataEntry<C extends DataCategory>(category: C, chainId: number): DataEntry<C> {
  return new DataEntry(category, chainId);
}

export class DataEntry<C extends DataCategory> {
  public readonly file: string;

  private static readonly BASE_DIR = "./data";
  private static readonly ENCODING = "utf8" as const;

  private data: ShapeMap[C] = {};

  constructor(
    public readonly category: C,
    public readonly chainId: number,
  ) {
    const chain = getChain(chainId);
    this.file = path.join(DataEntry.BASE_DIR, category, `${chain.key}.json`);
    fs.ensureDirSync(path.dirname(this.file));
    fs.ensureFileSync(this.file);
    this.load();
  }

  private load() {
    try {
      const raw = fs.readFileSync(this.file, DataEntry.ENCODING);
      this.data = JSON.parse(raw);
    } catch (err) {
      console.error(`Failed reading data from ${this.file}`, err);
      this.data = {};
    }
  }

  public read(key: keyof ShapeMap[C]) {
    return this.data[key];
  }

  public save(newData: Partial<ShapeMap[C]>) {
    this.data = _.merge({}, this.data, newData);
    try {
      fs.writeFileSync(this.file, JSON.stringify(this.data), DataEntry.ENCODING);
    } catch (err) {
      console.error(`Failed writing data to ${this.file}`, err);
    }
  }
}
