import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloLink } from "apollo-link";
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions';

import router from './router';
import App from "./App";
import { GC_USER_ID, GC_AUTH_TOKEN } from './constants/settings'

Vue.config.productionTip = false;

const httpLink = new HttpLink({
  uri: "https://api.graph.cool/simple/v1/cjuw2s97y0tvt0163wjt8beiq"
});

const wsClient = new SubscriptionClient('wss://subscriptions.ap-northeast-1.graph.cool/v1/cjuw2s97y0tvt0163wjt8beiq', {
  reconnect: true,
  connectionParams: {
    authToken: localStorage.getItem(GC_AUTH_TOKEN)
  }
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem(GC_AUTH_TOKEN)
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  })

  return forward(operation)
});

const httpLinkWithSubscriptions = addGraphQLSubscriptions(
  authMiddleware.concat(httpLink),
  wsClient
)

const apolloClient = new ApolloClient({
  link: httpLinkWithSubscriptions,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: "loading"
  }
});

const userId = localStorage.getItem(GC_USER_ID)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  apolloProvider: apolloProvider,
  data: { userId },
  render: h => h(App)
});
