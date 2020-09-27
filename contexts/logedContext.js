import { createContext } from 'react';
const LogedContext = createContext([false, () => {}]);

export default LogedContext;
