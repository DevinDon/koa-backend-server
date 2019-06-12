import { delay } from '@iinfinity/delay';
import Axios from 'axios';

namespace TestDemo {

  function getIndex() {
    return Axios.get('http://localhost:8080/user/list').then(v => v.data);
  }

  (async () => {
    for (let i = 0; i < 1000; i++) {
      console.log(`index: ${i}`);
      getIndex().then(v => console.log(`index: ${i}, value: ${v}`));
    }
  })();

}
