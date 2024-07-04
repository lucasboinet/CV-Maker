import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '@/styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from '@/context/Auth/'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </AuthProvider>
  );
}

export default MyApp;
