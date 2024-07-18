import React, { FunctionComponent, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DatabaseList from './DBHandler/DatabaseList';
import DatabaseDetails from './DBHandler/DatabaseDetails';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


interface IProps { }


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    },
  },
});


type status = 'WORKING' | 'NOT WORKING' | 'LOADING'

const statusInfo = {
  'WORKING': {
    statusMessage: 'Fake server is working',
    statusColor: 'green',
  },
  'NOT WORKING': {
    statusMessage: 'Fake server is not working',
    statusColor: 'red',
  },
  'LOADING': {
    statusMessage: 'Loading...',
    statusColor: 'yellow',
  },
};

const App: FunctionComponent<IProps> = () => {
  const [serverStatus, setServerStatus] = useState<status>('LOADING');

  const { statusMessage, statusColor } = useMemo(() => statusInfo[serverStatus], [serverStatus]);

  useEffect(() => {
    const fakeServerUrl = 'http://localhost:4000/databases';

    axios.get(fakeServerUrl)
      .then((response) => {
        setServerStatus('WORKING');
      })
      .catch(() => {
        setServerStatus('NOT WORKING');
      });
  }, []);

  return (

    <div>
      {serverStatus !== 'WORKING' &&
        <h5 style={{ color: statusColor }}>
          {statusMessage}
        </h5>
      }

      <div>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/details/:id" element={<DatabaseDetails />} />
              <Route path="/" element={<DatabaseList />} />
            </Routes>
          </QueryClientProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
