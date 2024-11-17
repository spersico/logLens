import { Suspense } from 'solid-js/web';

import './index.css';
import { NavBar } from './components/NavBar';
import { LogList } from './components/LogList';

export function App() {
  return (
    <Suspense>
      <main>
        <LogList />
      </main>
      <NavBar />
    </Suspense>
  );
}
