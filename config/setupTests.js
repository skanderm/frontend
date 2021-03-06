import {configure} from 'enzyme'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import Adapter from 'enzyme-adapter-react-16'

export default function init() {
  configure({adapter: new Adapter()})

  chai.use(chaiEnzyme())
}

init()
