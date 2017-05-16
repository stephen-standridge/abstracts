import chai from 'chai';
import abstracts from '../index'
import sinon from "sinon";
global.sinon = sinon;
global.abstracts = abstracts;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
