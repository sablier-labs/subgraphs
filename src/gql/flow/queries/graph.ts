import { gql } from "@src/out/gql/envio/flow/gql"; // circular reference on purpose

export const getStreams = gql(/* GraphQL */ `
  query getStreams(
    $first: Int!
    $skip: Int!
    $subgraphId: BigInt!
    $where: Stream_Filter!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: $where
    ) {
      ...StreamFragment
      actions(
        orderBy: timestamp
        orderDirection: desc
        where: { category_in: [Create, Adjust, Pause, Void, Restart] }
      ) {
        ...ActionFragment
      }
    }
  }
`);

export const getStreams_ByRecipientByIds = gql(/* GraphQL */ `
  query getStreams_ByRecipientByIds(
    $first: Int!
    $skip: Int!
    $chainId: BigInt!
    $recipient: Bytes!
    $streamIds: [String!]
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        recipient: $recipient
        id_in: $streamIds
        subgraphId_lt: $subgraphId
        chainId: $chainId
      }
    ) {
      ...StreamFragment
      actions(
        orderBy: timestamp
        orderDirection: desc
        where: { category_in: [Create, Adjust, Pause, Void, Restart] }
      ) {
        ...ActionFragment
      }
    }
  }
`);

export const getStreams_BySenderByIds = gql(/* GraphQL */ `
  query getStreams_BySenderByIds(
    $first: Int!
    $skip: Int!
    $chainId: BigInt!
    $sender: Bytes!
    $streamIds: [String!]
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        sender: $sender
        id_in: $streamIds
        subgraphId_lt: $subgraphId
        chainId: $chainId
      }
    ) {
      ...StreamFragment
      actions(
        orderBy: timestamp
        orderDirection: desc
        where: { category_in: [Create, Adjust, Pause, Void, Restart] }
      ) {
        ...ActionFragment
      }
    }
  }
`);
