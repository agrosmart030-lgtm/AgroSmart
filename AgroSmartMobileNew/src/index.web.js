import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from '../app.json';

// Registra o aplicativo para a web
AppRegistry.registerComponent(appName, () => App);

// Inicializa o aplicativo na web
if (window.document) {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}
