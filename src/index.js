import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { AUTH_TOKEN } from './constants';
import { StoreProvider } from 'easy-peasy';
import { store } from './store';
import {unregister} from './serviceWorker';
import './tailwind.output.css';

const token = localStorage.getItem(AUTH_TOKEN);

const client = new ApolloClient({
  uri: '/graphql',
  headers: {
    authorization: token ? `Bearer ${token}` : '',
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
    <BrowserRouter>
        <StoreProvider store={store}>
            <ApolloProvider client={client}>
                 <App />
            </ApolloProvider>
        </StoreProvider>
    </BrowserRouter>
);

ReactDOM.render( app, document.getElementById('root'));
unregister();