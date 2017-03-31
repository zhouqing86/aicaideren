import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.use(chaiAsPromised).should();