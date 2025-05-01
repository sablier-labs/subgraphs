import { gql } from "graphql-request";
import * as F from "./fragments";

export const getStreams_BySenderByRecipientByIdsByToken = gql/* GraphQL */ `
  query getStreams_BySenderByRecipientByIdsByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $sender: String!
    $recipient: String!
    $token: String!
    $streamIds: [String!]
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      order_by: { subgraphId: desc }
      distinct_on: [subgraphId]
      where: {
        _and: [
          { asset_id: { _iregex: $token } }
          { chainId: { _eq: $chainId } }
          { sender: { _eq: $sender } }
          { recipient: { _eq: $recipient } }
          { id: { _in: $streamIds } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;
//

export const getStreams_BySenderByRecipientByIds = gql/* GraphQL */ `
  query getStreams_BySenderByRecipientByIds(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $sender: String!
    $recipient: String!
    $streamIds: [String!]
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { sender: { _eq: $sender } }
          { recipient: { _eq: $recipient } }
          { id: { _in: $streamIds } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_BySenderByIdsByToken = gql/* GraphQL */ `
  query getStreams_BySenderByIdsByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $sender: String!
    $token: String!
    $streamIds: [String!]
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { asset_id: { _iregex: $token } }
          { chainId: { _eq: $chainId } }
          { sender: { _eq: $sender } }
          { id: { _in: $streamIds } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_ByRecipientByIdsByToken = gql/* GraphQL */ `
  query getStreams_ByRecipientByIdsByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $recipient: String!
    $token: String!
    $streamIds: [String!]
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { asset_id: { _iregex: $token } }
          { chainId: { _eq: $chainId } }
          { recipient: { _eq: $recipient } }
          { id: { _in: $streamIds } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_BySenderByRecipientByToken = gql/* GraphQL */ `
  query getStreams_BySenderByRecipientByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $sender: String!
    $recipient: String!
    $token: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { asset_id: { _iregex: $token } }
          { chainId: { _eq: $chainId } }
          { sender: { _eq: $sender } }
          { recipient: { _eq: $recipient } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_ByRecipientByIds = gql/* GraphQL */ `
  query getStreams_ByRecipientByIds(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $recipient: String!
    $streamIds: [String!]
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { recipient: { _eq: $recipient } }
          { id: { _in: $streamIds } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_BySenderByIds = gql/* GraphQL */ `
  query getStreams_BySenderByIds(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $sender: String!
    $streamIds: [String!]
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { sender: { _eq: $sender } }
          { id: { _in: $streamIds } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_BySenderByRecipient = gql/* GraphQL */ `
  query getStreams_BySenderByRecipient(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $recipient: String!
    $sender: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { sender: { _eq: $sender } }
          { recipient: { _eq: $recipient } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_ByIdsByToken = gql/* GraphQL */ `
  query getStreams_ByIdsByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $token: String!
    $streamIds: [String!]
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { asset_id: { _iregex: $token } }
          { chainId: { _eq: $chainId } }
          { id: { _in: $streamIds } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_ByRecipientByToken = gql/* GraphQL */ `
  query getStreams_ByRecipientByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $recipient: String!
    $token: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { asset_id: { _iregex: $token } }
          { chainId: { _eq: $chainId } }
          { recipient: { _eq: $recipient } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_BySenderByToken = gql/* GraphQL */ `
  query getStreams_BySenderByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $token: String!
    $sender: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { asset_id: { _iregex: $token } }
          { chainId: { _eq: $chainId } }
          { sender: { _eq: $sender } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

//
export const getStreams_BySender_Or_ByRecipient_Or_ByToken = gql/* GraphQL */ `
  query getStreams_BySender_Or_ByRecipient_Or_ByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $recipient: String!
    $sender: String!
    $token: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _or: [
          {
            _and: [
              { chainId: { _eq: $chainId } }
              { sender: { _eq: $sender } }
              { subgraphId: { _lt: $subgraphId } }
            ]
          }
          {
            _and: [
              { chainId: { _eq: $chainId } }
              { recipient: { _eq: $recipient } }
              { subgraphId: { _lt: $subgraphId } }
            ]
          }
          {
            _and: [
              { chainId: { _eq: $chainId } }
              { asset_id: { _iregex: $token } }
              { subgraphId: { _lt: $subgraphId } }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;
//

export const getStreams_BySender_Or_ByRecipient = gql/* GraphQL */ `
  query getStreams_BySender_Or_ByRecipient(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $recipient: String!
    $sender: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _or: [
          {
            _and: [
              { chainId: { _eq: $chainId } }
              { sender: { _eq: $sender } }
              { subgraphId: { _lt: $subgraphId } }
            ]
          }
          {
            _and: [
              { chainId: { _eq: $chainId } }
              { recipient: { _eq: $recipient } }
              { subgraphId: { _lt: $subgraphId } }
            ]
          }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_BySender = gql/* GraphQL */ `
  query getStreams_BySender(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $sender: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { sender: { _eq: $sender } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_ByRecipient = gql/* GraphQL */ `
  query getStreams_ByRecipient(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $recipient: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { recipient: { _eq: $recipient } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_ByIds = gql/* GraphQL */ `
  query getStreams_ByIds(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $streamIds: [String!]
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { id: { _in: $streamIds } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_ByToken = gql/* GraphQL */ `
  query getStreams_ByToken(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $token: String!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { asset_id: { _iregex: $token } }
          { chainId: { _eq: $chainId } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

//
export const getStreams = gql/* GraphQL */ `
  query getStreams(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreams_Asc = gql/* GraphQL */ `
  query getStreams_Asc(
    $first: Int!
    $chainId: numeric!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      distinct_on: [subgraphId]
      order_by: { subgraphId: asc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { subgraphId: { _gt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
      actions(
        order_by: { timestamp: desc }
        where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.BatchFragment_Envio}
  ${F.ContractFragment_Envio}
  ${F.StreamFragment_Envio}
`;

export const getStreamAliases_Asc = gql/* GraphQL */ `
  query getStreamsAliases_Asc(
    $first: Int!
    $subgraphId: numeric!
    $chainId: numeric!
  ) {
    Stream(
      limit: $first
      distinct_on: [subgraphId]
      order_by: { subgraphId: asc }
      where: { chainId: { _eq: $chainId }, subgraphId: { _gt: $subgraphId } }
    ) {
      alias
      subgraphId
      category
    }
  }
`;
