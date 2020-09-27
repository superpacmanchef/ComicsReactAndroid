import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LogedContext from './contexts/logedContext';
import { PullContext } from './contexts/pullContext';
import TabNav from './components/tabNav';

export default function App() {
  const loged = useState(false);
  const pull = useState([]);
  return (
    <LogedContext.Provider value={loged}>
      <PullContext.Provider value={pull}>
        <NavigationContainer>
          <TabNav />
        </NavigationContainer>
      </PullContext.Provider>
    </LogedContext.Provider>
  );
}
