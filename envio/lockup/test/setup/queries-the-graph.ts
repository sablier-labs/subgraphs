import { gql } from "graphql-request";
import * as F from "./fragments";

//
export const getStreams_BySenderByRecipientByIdsByToken = gql/* GraphQL */ `
  query getStreams_BySenderByRecipientByIdsByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $sender: Bytes!
    $recipient: Bytes!
    $token: String!
    $streamIds: [String!]
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        or: [
          {
            and: [
              { asset: $token }
              { sender: $sender }
              { recipient: $recipient }
              { id_in: $streamIds }
              { subgraphId_lt: $subgraphId }
            ]
          }
          {
            and: [
              { asset: $token }
              { proxender: $sender }
              { recipient: $recipient }
              { id_in: $streamIds }
              { subgraphId_lt: $subgraphId }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;
//

export const getStreams_BySenderByRecipientByIds = gql/* GraphQL */ `
  query getStreams_BySenderByRecipientByIds(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $sender: Bytes!
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
        or: [
          {
            and: [
              { sender: $sender }
              { recipient: $recipient }
              { id_in: $streamIds }
              { subgraphId_lt: $subgraphId }
            ]
          }
          {
            and: [
              { proxender: $sender }
              { recipient: $recipient }
              { id_in: $streamIds }
              { subgraphId_lt: $subgraphId }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_BySenderByIdsByToken = gql/* GraphQL */ `
  query getStreams_BySenderByIdsByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $sender: Bytes!
    $token: String!
    $streamIds: [String!]
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        or: [
          {
            and: [
              { asset: $token }
              { sender: $sender }
              { id_in: $streamIds }
              { subgraphId_lt: $subgraphId }
            ]
          }
          {
            and: [
              { asset: $token }
              { proxender: $sender }
              { id_in: $streamIds }
              { subgraphId_lt: $subgraphId }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_ByRecipientByIdsByToken = gql/* GraphQL */ `
  query getStreams_ByRecipientByIdsByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $recipient: Bytes!
    $token: String!
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
        asset: $token
        id_in: $streamIds
        subgraphId_lt: $subgraphId
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_BySenderByRecipientByToken = gql/* GraphQL */ `
  query getStreams_BySenderByRecipientByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $sender: Bytes!
    $recipient: Bytes!
    $token: String!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        or: [
          {
            and: [
              { asset: $token }
              { sender: $sender }
              { recipient: $recipient }
              { subgraphId_lt: $subgraphId }
            ]
          }
          {
            and: [
              { asset: $token }
              { proxender: $sender }
              { recipient: $recipient }
              { subgraphId_lt: $subgraphId }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_ByRecipientByIds = gql/* GraphQL */ `
  query getStreams_ByRecipientByIds(
    $first: Int!
    $skip: Int!
    $chainId: Int!
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
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_BySenderByIds = gql/* GraphQL */ `
  query getStreams_BySenderByIds(
    $first: Int!
    $skip: Int!
    $chainId: Int!
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
        or: [
          {
            and: [
              { sender: $sender }
              { id_in: $streamIds }
              { subgraphId_lt: $subgraphId }
            ]
          }
          {
            and: [
              { proxender: $sender }
              { id_in: $streamIds }
              { subgraphId_lt: $subgraphId }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_BySenderByRecipient = gql/* GraphQL */ `
  query getStreams_BySenderByRecipient(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $recipient: Bytes!
    $sender: Bytes!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        or: [
          {
            and: [
              { sender: $sender }
              { recipient: $recipient }
              { subgraphId_lt: $subgraphId }
            ]
          }
          {
            and: [
              { proxender: $sender }
              { recipient: $recipient }
              { subgraphId_lt: $subgraphId }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_ByIdsByToken = gql/* GraphQL */ `
  query getStreams_ByIdsByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $token: String!
    $streamIds: [String!]
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: { asset: $token, id_in: $streamIds, subgraphId_lt: $subgraphId }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_ByRecipientByToken = gql/* GraphQL */ `
  query getStreams_ByRecipientByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $recipient: Bytes!
    $token: String!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        recipient: $recipient
        asset: $token
        subgraphId_lt: $subgraphId
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_BySenderByToken = gql/* GraphQL */ `
  query getStreams_BySenderByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $token: String!
    $sender: Bytes!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        or: [
          {
            and: [
              { asset: $token }
              { sender: $sender }
              { subgraphId_lt: $subgraphId }
            ]
          }
          {
            and: [
              { asset: $token }
              { proxender: $sender }
              { subgraphId_lt: $subgraphId }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_BySender_Or_ByRecipient = gql/* GraphQL */ `
  query getStreams_BySender_Or_ByRecipient(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $recipient: Bytes!
    $sender: Bytes!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        or: [
          { and: [{ sender: $sender }, { subgraphId_lt: $subgraphId }] }
          { and: [{ proxender: $sender }, { subgraphId_lt: $subgraphId }] }
          { and: [{ recipient: $recipient }, { subgraphId_lt: $subgraphId }] }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_BySender = gql/* GraphQL */ `
  query getStreams_BySender(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $sender: Bytes!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        or: [
          { and: [{ sender: $sender }, { subgraphId_lt: $subgraphId }] }
          { and: [{ proxender: $sender }, { subgraphId_lt: $subgraphId }] }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_ByRecipient = gql/* GraphQL */ `
  query getStreams_ByRecipient(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $recipient: Bytes!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: { recipient: $recipient, subgraphId_lt: $subgraphId }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_ByIds = gql/* GraphQL */ `
  query getStreams_ByIds(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $streamIds: [String!]
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: { id_in: $streamIds, subgraphId_lt: $subgraphId }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_ByToken = gql/* GraphQL */ `
  query getStreams_ByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $token: String!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: { asset: $token, subgraphId_lt: $subgraphId }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

//
export const getStreams_BySender_Or_ByRecipient_Or_ByToken = gql/* GraphQL */ `
  query getStreams_BySender_Or_ByRecipient_Or_ByToken(
    $first: Int!
    $skip: Int!
    $chainId: Int!
    $recipient: Bytes!
    $sender: Bytes!
    $token: String!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        or: [
          { and: [{ sender: $sender }, { subgraphId_lt: $subgraphId }] }
          { and: [{ proxender: $sender }, { subgraphId_lt: $subgraphId }] }
          { and: [{ recipient: $recipient }, { subgraphId_lt: $subgraphId }] }
          { and: [{ asset: $token }, { subgraphId_lt: $subgraphId }] }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;
//

//
export const getStreams = gql/* GraphQL */ `
  query getStreams(
    $first: Int!
    $skip: Int!
    $chainId: BigInt!
    $subgraphId: BigInt!
  ) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: { subgraphId_lt: $subgraphId }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreams_Asc = gql/* GraphQL */ `
  query getStreams_Asc($first: Int!, $chainId: BigInt!, $subgraphId: BigInt!) {
    streams(
      first: $first
      orderBy: subgraphId
      orderDirection: asc
      where: { subgraphId_gt: $subgraphId }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.BatchFragment_TheGraph}
  ${F.ContractFragment_TheGraph}
  ${F.SegmentFragment_TheGraph}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getStreamAliases_Asc = gql/* GraphQL */ `
  query getStreamIds($first: Int!, $subgraphId: Int!, $chainId: BigInt!) {
    streams(
      first: $first
      where: { subgraphId_gt: $subgraphId }
      orderBy: subgraphId
      orderDirection: asc
    ) {
      alias
      subgraphId
      category
    }
  }
`;
