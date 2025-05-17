import type { Indexed } from "@src/types";
import { gql } from "graphql-tag";

export function getWatcherDefs(protocol: Indexed.Protocol) {
  const protocolField =
    protocol === "airdrops"
      ? `"""
       Global counter for campaigns.
       """
       campaignCounter: BigInt!`
      : `"""
       Global index for streams.
       """
       streamCounter: BigInt!`;

  return gql`
    type Watcher @entity(immutable: false) {
      """
      The chain ID. There is one watcher per subgraph.
      """
      id: String!

      """
      Global counter for actions.
      """
      actionCounter: BigInt!

      """
      Alias for id.
      """
      chainId: BigInt!

      """
      Used for debugging purposes. They are normally empty.
      """
      logs: [String!]
      ${protocolField}
    }
  `;
}
