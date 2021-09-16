import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import {
  SUBGRAPH_SMARTDEX,
  SUBGRAPH_STAKING,
  SUBGRAPH_TOKEN,
} from "../variables/urls";

export const client_token = new ApolloClient({
  link: new HttpLink({ uri: SUBGRAPH_TOKEN }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const client_staking = new ApolloClient({
  link: new HttpLink({ uri: SUBGRAPH_STAKING }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const client_smartdex = new ApolloClient({
  link: new HttpLink({ uri: SUBGRAPH_SMARTDEX }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});
