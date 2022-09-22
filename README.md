# Kalmia Frontend

## Stack

- node 16.16.0
- Nuxt 3
- Vue 3 w/ TypeScript
- Pinia Store
- Vuelidate 2
- TailwindCSS
- PostCSS

## Team

| Person     | Email                | Role       |
| ---------- | -------------------- | ---------- |
| Simon Šenk | simon.senk@kalmia.si | Maintainer |

## Info

### API

API interaction should be done with [mande](https://github.com/posva/mande) api wrapper. Globally imported as `$api`.

**Error handling TODO**

```js
await $api.get('/login', formData);
```

### Vueuse

Many common tasks can be solved with using helper functions from [vueuse](https://vueuse.org/functions.html). Use those instead of reinventing the wheel.

eg.

```js
useIntersectionObserver();
useInfiniteScroll();
useScroll();
useScrollLock();
```

### Images

Use `<Image />` component to lazy load images. Implements [v-lazy-image](https://github.com/alexjoverm/v-lazy-image). `:src` can be link to (eg. public assets `./images/test.png`), or image imported as module.

For images that dont need lazy load, use html `<img>`. The `:src` can then also be provided with resolve token (eg. `~/assets/images/test.png`).

```html
<script>
  import imgTest from '~/assets/images/test.png';
</script>

<image :src="imgTest" width="1436" height="1513" />

<image src="./images/test.png" width="1436" height="1513" />

<img src="~/assets/images/test.png" width="1436" height="1513" />
```

### Icons

Add icon svg to `/assets/icons`, then use `<NuxtIcon :name="" />` component to use the icon - set name prop to filename. Implements [nuxt-icons](https://github.com/gitFoxCode/nuxt-icons).

Control size with font-size.

```html
<NuxtIcon name="larr" class="inline-block text-[18px] mr-3 align-middle" />
```

### Breakpoints

For basic styles, use tailwind breakpoint system. For js usage, use `useScreen` composable.

```js
const screens = reactive(useScreen());
// or
const { isXl } = useScreen();
```

```html
<div v-if="screens.isXl" class="w-8 h-8 bg-red"></div>
<div v-else class="w-8 h-8 bg-blue"></div>
```
