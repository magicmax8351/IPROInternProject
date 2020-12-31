# IPROInternProject

## Reference Materials 

### `js-cookie`

Link: https://github.com/js-cookie/js-cookie

Usage: 

```JavaScript
import Cookies from 'js-cookie'

Cookies.set('foo', 'bar');
Cookies.set('name', 'value', { expires: 7 });
Cookies.set('name', 'value', { expires: 7, path: '' });

Cookies.get('name'); // => 'value'
Cookies.get('nothing'); // => undefined

Cookies.set('name', 'value', { path: '' })
Cookies.remove('name') // fail!
Cookies.remove('name', { path: '' }) // removed!


```