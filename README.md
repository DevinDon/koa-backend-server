# Rester

**How do you think about Spring Boot?**

**In Node.js & TypeScript!**

> 📚 ​See the [full documents](https://github.com/DevinDon/rester-core/tree/master/docs) here.

# Attention

<span style="color: red">**:warning: WARNING: This project is currently in an *UNSTABLE* phase.**</span>

> 📢 Attention: The **STABLE** version will arrive at 1.0.0

# Installation

This project has released on [NPMJS.COM, @rester/core](https://www.npmjs.com/package/@rester/core).

```shell
npm i --save @rester/core
```

> 💫 ​The **Command-Line Interface** will be coming soon. Watch [@rester/cli](https://www.npmjs.com/package/@rester/cli).

# Usage

Use **Rester** just like **Spring Boot**, and easier!

```typescript
import { View, GET, Rester } from '@rester/core';

@View()
class DemoView {

  /** GET http://localhost:8080 */
  @GET('/')
  index() {
    return { hello: 'world' };
  }

}

/** Create a rester server listening on http://localhost:8080. */
const server = new Rester()
  .configViews.add(DemoView).end()
  .listen();
```

> 🗂 See more [demo](https://github.com/DevinDon/rester-core/blob/master/src/demo) here.

# Feature

> ✨ See issue [#4](https://github.com/DevinDon/rester-core/issues/4) for detail.

# Change Log

> 📄 See [change log](https://github.com/DevinDon/rester-core/blob/master/docs/CHANGELOG.md) for detail.

## 0.10.12 => 0.10.13

- feat(handler/exception): determine whether to display stack info through the debug flag

# Author

IInfinity 夜寒苏, [Email](mailto:I.INF@Outlook.com), [Github](https://github.com/DevinDon), [Home Page (Under construction)](https://blog.don.red).

# License

[THE MIT LICENSE](https://raw.githubusercontent.com/DevinDon/license/master/THE%20MIT%20LICENSE) for code.

Copyright © 2018+ Devin Don

LICENSE: MIT

Click https://raw.githubusercontent.com/DevinDon/license/master/THE%20MIT%20LICENSE to view a copy of this license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[THE CC-BY-NC-4.0 LICENSE](https://raw.githubusercontent.com/DevinDon/license/master/THE%20CC%20BY-NC%204.0%20LICENSE)

Copyright © 2018+ Devin Don

LICENSE: CC BY-NC 4.0

Click https://raw.githubusercontent.com/DevinDon/license/master/THE%20CC%20BY-NC%204.0%20LICENSE to view a copy of this license.

This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.

To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/

or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
