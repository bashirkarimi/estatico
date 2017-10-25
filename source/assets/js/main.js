import 'babel-polyfill';
import 'handlebars/dist/handlebars';
import './helpers/module';
import './helpers/svgspriteloader';
import EstaticoApp from './helpers/estaticoapp';

let app = new EstaticoApp();

app.start();
