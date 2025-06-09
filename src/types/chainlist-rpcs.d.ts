/**
 * @see https://github.com/actuallymentor/chainlist-rpcs/issues/1
 */
declare module "chainlist-rpcs" {
  interface RPCEndpoint {
    url: string;
    tracking: string;
    trackingDetails: string;
  }

  interface GetRPCsParams {
    chain_id?: number;
    chain_name?: string;
    allowed_tracking?: string[];
  }

  export function get_rpcs_for_chain(params: GetRPCsParams): (string | RPCEndpoint)[];
}
