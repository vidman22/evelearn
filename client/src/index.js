import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import reducer from './store/reducer';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient  from 'apollo-boost';
import { InMemoryCache } from 'apollo-boost';
import { AUTH_TOKEN } from './constants';

import {unregister} from './serviceWorker';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
const token = localStorage.getItem(AUTH_TOKEN);

// const httpLink = createHttpLink({
//   uri: 'http://localhost:5000/graphql',
// });

const client = new ApolloClient({
  uri: '/graphql',
  headers: {
    authorization: token ? `Bearer ${token}` : "",
  },
  clientState: {
    defaults: {
      isConnected: true
    },
    resolvers: {
      Mutation: {
        updatedNetworkStatus: (_, { isConnected}, {cache}) => {
          cache.writeData({data: {isConnected}});
          return null;
        }
      }
    }
  },
  cache: new InMemoryCache({addTypename: false})
});

const app = (

  <Provider store={store} >
   
    <BrowserRouter>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>
    </BrowserRouter>
   
  </Provider>

);

ReactDOM.render( app, document.getElementById('root'));
unregister();