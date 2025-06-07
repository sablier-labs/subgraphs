import { chains, Protocol } from "@sablier/deployments";
import type { Indexer } from "../types";
import { resolveGraphCustom, resolveGraphOfficial } from "./resolver";

type SubgraphId = string;
type SubgraphIdMap = Record<Indexer.Protocol, SubgraphId>;
type IndexerGraphMap = Record<Indexer.Protocol, Indexer.Graph>;

function custom(chainId: number, baseURL: string): IndexerGraphMap {
  return {
    airdrops: resolveGraphCustom(Protocol.Airdrops, chainId, baseURL),
    flow: resolveGraphCustom(Protocol.Flow, chainId, baseURL),
    lockup: resolveGraphCustom(Protocol.Lockup, chainId, baseURL),
  };
}

function official(chainId: number, idMap: SubgraphIdMap): IndexerGraphMap {
  return {
    airdrops: resolveGraphOfficial(Protocol.Airdrops, chainId, idMap.airdrops),
    flow: resolveGraphOfficial(Protocol.Flow, chainId, idMap.flow),
    lockup: resolveGraphOfficial(Protocol.Lockup, chainId, idMap.lockup),
  };
}

const customs: IndexerGraphMap[] = [
  /* -------------------------------------------------------------------------- */
  /*                                    FORM                                    */
  /* -------------------------------------------------------------------------- */
  custom(chains.form.id, "TODO"),

  /* -------------------------------------------------------------------------- */
  /*                                  LIGHTLINK                                 */
  /* -------------------------------------------------------------------------- */
  custom(chains.lightlink.id, "https://graph.phoenix.lightlink.io/query/subgraphs/name/lightlink"),

  /* -------------------------------------------------------------------------- */
  /*                                    XDC                                     */
  /* -------------------------------------------------------------------------- */
  custom(chains.xdc.id, "https://graphql.xinfin.network/subgraphs/name/xdc"),
];

const officials: IndexerGraphMap[] = [
  /* -------------------------------------------------------------------------- */
  /*                                  ABSTRACT                                  */
  /* -------------------------------------------------------------------------- */
  official(chains.abstract.id, {
    airdrops: "DRrf6mYEhRt9QieKvTjDHnSWcBm3GW96hpedMKVxLABx",
    flow: "Gq3e1gihMoSynURwGXQnPoKGVZzdsyomdrMH934vQHuG",
    lockup: "2QjTdDFY233faXksUruMERMiDoQDdtGG5hBLC27aT1Pw",
  }),
  /* -------------------------------------------------------------------------- */
  /*                                  ARBITRUM                                  */
  /* -------------------------------------------------------------------------- */
  official(chains.arbitrum.id, {
    airdrops: "HkHDg6NVVVeobhpcU4pTPMktyC25zd6xAQBGpYrWDgRr",
    flow: "C3kBBUVtW2rxqGpAgSgEuSaT49izkH6Q8UibRt7XFTyW",
    lockup: "yvDXXHSyv6rGPSzfpbBcbQmMFrECac3Q2zADkYsMxam",
  }),
  /* -------------------------------------------------------------------------- */
  /*                              ARBITRUM SEPOLIA                              */
  /* -------------------------------------------------------------------------- */
  official(chains.arbitrumSepolia.id, {
    airdrops: "3S7v3VkDq8XMBd8EFVhKur2Vk44xScaW8a4BRjoPuYWk",
    flow: "2uWnxpYiDMkEMu1urxqt925mLfuax9XbvfcBoD97AU6d",
    lockup: "ApEFvaPGARHedGmFp6TRQu7DoDHQKwt1LPWi1ka6DFHT",
  }),
  /* -------------------------------------------------------------------------- */
  /*                                  AVALANCHE                                */
  /* -------------------------------------------------------------------------- */
  official(chains.avalanche.id, {
    airdrops: "CpbN5Ps25UzqfdoqYdrjoSK4Him6nwDvdLK6a2sGS1PA",
    flow: "6PAizjTALVqLLB7Ycq6XnpTeck8Z8QUpDFnVznMnisUh",
    lockup: "FTDmonvFEm1VGkzECcnDY2CPHcW5dSmHRurSjEEfTkCX",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                    BASE                                    */
  /* -------------------------------------------------------------------------- */
  official(chains.base.id, {
    airdrops: "4SxPXkQNifgBYqje2C4yP5gz69erZwtD7GuLWgXHSLGe",
    flow: "4XSxXh8ZgkzaA35nrbQG9Ry3FYz3ZFD8QBdWwVg5pF9W",
    lockup: "778GfecD9tsyB4xNnz4wfuAyfHU6rqGr79VCPZKu3t2F",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                BASE SEPOLIA                                */
  /* -------------------------------------------------------------------------- */
  official(chains.baseSepolia.id, {
    airdrops: "4R2hm27YJ7CVEJ97BbBJz2r4KTKYc8sTqqzrD8UzEfJt",
    flow: "AsnKT1waQMvuQxZAqfFuYwtRtAfN8uekDu75jPttfyLh",
    lockup: "DdiYENuyh5ztSybRJnBnCZuUgESkFasjGFHZUbURpKHz",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                  BERACHAIN                                 */
  /* -------------------------------------------------------------------------- */
  official(chains.berachain.id, {
    airdrops: "CnYsdmzuY3Mebwywvqv1WrXw9UZuPMTrxoGgR2UdThJE",
    flow: "J87eaBLfTe7kKWgUGqe5TxntNCzA4pyWmqJowMddehuh",
    lockup: "C2r13APcUemQtVdPFm7p7T3aJkU2rH2EvdZzrQ53zi14",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                    BLAST                                   */
  /* -------------------------------------------------------------------------- */
  official(chains.blast.id, {
    airdrops: "657bogqYaDSSeqsoJcJ1kRqGnc3jC15UmcVLzsYxyxKK",
    flow: "8joiC9LpUbSV6eGRr3RWXDArM8p9Q65FKiFekAakkyia",
    lockup: "8MBBc6ET4izgJRrybgWzPjokhZKSjk43BNY1q3xcb8Es",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                    BSC                                     */
  /* -------------------------------------------------------------------------- */
  official(chains.bsc.id, {
    airdrops: "FXQT42kQPvpMJgsF5Bs6CqpxVvPP1LBqEhWThCCLMeGL",
    flow: "2vU8KF4yWh3vvFjtg7MrRXMnYF3hPX2T3cvVBdaiXhNb",
    lockup: "A8Vc9hi7j45u7P8Uw5dg4uqYJgPo4x1rB4oZtTVaiccK",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                  CHILIZ                                   */
  /* -------------------------------------------------------------------------- */
  official(chains.chiliz.id, {
    airdrops: "6LK1aqrhzZCp6c88MEBDAR1VDLpZQiXpBKkceJ5Lu4LU",
    flow: "7QX7tJsANNFpxFLLjqzmXRzfY1wPGp3Lty5xGbhgADa6",
    lockup: "4KsXUFvsKFHH7Q8k3BPgEv2NhCJJGwG78gCPAUpncYb",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                  ETHEREUM                                  */
  /* -------------------------------------------------------------------------- */
  official(chains.ethereum.id, {
    airdrops: "DFD73EcSue44R7mpHvXeyvcgaT8tR1iKakZFjBsiFpjs",
    flow: "ECxBJhKceBGaVvK6vqmK3VQAncKwPeAQutEb8TeiUiod",
    lockup: "AvDAMYYHGaEwn9F9585uqq6MM5CfvRtYcb7KjK7LKPCt",
  }),

  /* -------------------------------------------------------------------------- */
  /*                              ETHEREUM SEPOLIA                              */
  /* -------------------------------------------------------------------------- */
  official(chains.ethereumSepolia.id, {
    airdrops: "8PLGDyXEsPgRTAnozL7MAjmTUFY4TBzs8i4F9Pq3wwSh",
    flow: "EU9AWmJjrjMRkjxcdHfuWPZvPTNAL3hiXfNGN5MwUpvm",
    lockup: "5yDtFSxyRuqyjvGJyyuQhMEW3Uah7Ddy2KFSKVhy9VMa",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                   GNOSIS                                   */
  /* -------------------------------------------------------------------------- */
  official(chains.gnosis.id, {
    airdrops: "kQEY5PYbjx4SMKyMUwqJHRLDzKH1aUqGsf1cnibU7Kn",
    flow: "4KiJ53cTNKdFWPBPmDNQ55tYj8hn1WQg8R4UcTY2STLL",
    lockup: "DtKniy1RvB19q1r2g1WLN4reMNKDacEnuAjh284rW2iK",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                    IOTEX                                   */
  /* -------------------------------------------------------------------------- */
  official(chains.iotex.id, {
    airdrops: "G39uCzr1FDY7pBFe8DwShAxhMeC6dbZetutVg6wjtks3",
    flow: "6No3QmRiC8HXLEerDFoBpF47jUPRjhntmv28HHEMxcA2",
    lockup: "2P3sxwmcWBjMUv1C79Jh4h6VopBaBZeTocYWDUQqwWFV",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                    LINEA                                   */
  /* -------------------------------------------------------------------------- */
  official(chains.linea.id, {
    airdrops: "6koYFSd8FQizdQWLTdRpL1yTmAbpMgN1vZN5W6ajZiTN",
    flow: "DV9XgcCCPKzUn6pgetg4yPetpW2fNoRKBUQC43aNeLG6",
    lockup: "GvpecytqVzLzuwuQB3enozXoaZRFoVx8Kr7qrfMiE9bs",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                    MODE                                    */
  /* -------------------------------------------------------------------------- */
  official(chains.mode.id, {
    airdrops: "HZMkVX5c2qf7BqbidwpcQMsHGWTDdEKwVjnwenzo9s6m",
    flow: "9TwfoUZoxYUyxzDgspCPyxW6uMUKetWQDaTGsZjY1qJZ",
    lockup: "oSBvUM371as1pJh8HQ72NMRMb3foV3wuheULfkNf5vy",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                  OPTIMISM                                  */
  /* -------------------------------------------------------------------------- */
  official(chains.optimism.id, {
    airdrops: "CHJtCNDzPqngpa1YJoaVrjuufZL6k6VkEkG9ZFUMQzF7",
    flow: "AygPgsehNGSB4K7DYYtvBPhTpEiU4dCu3nt95bh9FhRf",
    lockup: "NZHzd2JNFKhHP5EWUiDxa5TaxGCFbSD4g6YnYr8JGi6",
  }),

  /* -------------------------------------------------------------------------- */
  /*                              OPTIMISM SEPOLIA                              */
  /* -------------------------------------------------------------------------- */
  official(chains.optimismSepolia.id, {
    airdrops: "3kp1eR2T1XpvvLkSZ7Wtt45DbDaiykTes478RZ7zwTz",
    flow: "EFKqBB6TeH6etGuHCffnbMbETEgDZ6U29Lgpc4gpYvdB",
    lockup: "2LFYyhMVMUMYA2q7XMMnBvCs6v6awWxBeMuMk3tMtmiT",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                   POLYGON                                  */
  /* -------------------------------------------------------------------------- */
  official(chains.polygon.id, {
    airdrops: "FRbBKiDyM5YpFAqHLXRfQWwQdMGzFL82hqoPXPpXzAHE",
    flow: "ykp38sLarwz3cpmjSSPqo7UuTjYtkZ1KiL4PM2qwmT8",
    lockup: "8fgeQMEQ8sskVeWE5nvtsVL2VpezDrAkx2d1VeiHiheu",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                   SCROLL                                   */
  /* -------------------------------------------------------------------------- */
  official(chains.scroll.id, {
    airdrops: "Ev4xS8VxuoUcpgqz5A2BkTgQxQeskm4Fg41XzVJ2DX9",
    flow: "HFpTrPzJyrHKWZ9ebb4VFRQSxRwpepyfz5wd138daFkF",
    lockup: "GycpYx8c9eRqxvEAfqnpNd1ZfXeuLzjRhnG7vvYaqEE1",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                    SEI                                     */
  /* -------------------------------------------------------------------------- */
  official(chains.sei.id, {
    airdrops: "HCxLCRqd5MorHXxmXFUBBcA71zTGXnn97Xk2uaBmStsy",
    flow: "41ZGYcFgL2N7L5ng78S4sD6NHDNYEYcNFxnz4T8Zh3iU",
    lockup: "AJU5rBfbuApuJpeZeaz6NYuYnnhAhEy4gFkqsSdAT6xb",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                  UNICHAIN                                  */
  /* -------------------------------------------------------------------------- */
  official(chains.unichain.id, {
    airdrops: "4rQMJ85hKNhcaDyirGipGvcqS4auGU3QCFRBnpiexyNy",
    flow: "Cb5uDYfy4ukN9fjhQ3PQZgDzyo6G66ztn1e847rS7Xa8",
    lockup: "3MUG4H3gZcp9fpGLiJMTMeUFcQQ6QdT317P4wYKyns9M",
  }),

  /* -------------------------------------------------------------------------- */
  /*                                   ZKSYNC                                   */
  /* -------------------------------------------------------------------------- */
  official(chains.zksync.id, {
    airdrops: "64iDUwNVWKukw67nqTXif5taEfLug4Qf1c2suAv5hrqN",
    flow: "9DRgWhDAMovpkej3eT8izum6jxEKHE62ciArffsTAScx",
    lockup: "5yDtFSxyRuqyjvGJyyuQhMEW3Uah7Ddy2KFSKVhy9VMa",
  }),
];

const all: IndexerGraphMap[] = [...customs, ...officials];

export const graph: Record<Indexer.Protocol, Indexer.Graph[]> = {
  airdrops: all.map((g) => g.airdrops),
  flow: all.map((g) => g.flow),
  lockup: all.map((g) => g.lockup),
};
