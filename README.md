# Apillon - A Web3 development platform

This repository contains source code for the Dashboard frontend.

## Stack

- node 20.8.1
- Nuxt 3
- Vue 3 w/ TypeScript
- Pinia Store
- NaiveUI
- TailwindCSS
- Wagmi & viem

## Authors

| Name            | Role               | Email                      |
| --------------- | ------------------ | -------------------------- |
| Tadej Vengust   | Tech Lead          | tadej@kalmia.si            |
| Tine Mlakar     | Architect & DevOps | tine@kalmia.si             |
| Vinko Šmid      | Lead Developer     | vinko.smid@kalmia.si       |
| Urban Kovač     | Frontend Developer | urban.kovac@kalmia.si      |
| Damjan Dimitrov | Backend developer  | damjan.dimitrov@apillon.io |
| Tadej Rudel     | Backend developer  | tadej.rudel@apillon.io     |

## Info

### API

API interaction should be done with `fetch` api wrapper. Globally imported as `$api`.

```js
await $api.get('/login', formData);
```

### Blockchain

Blockchain connection is realized with [viem](https://viem.sh/) and [wagmi](https://github.com/wagmi-dev/wagmi). For easier integration, a vue wrapper is used: [use-wagmi](https://github.com/unicape/use-wagmi). Docs for react hooks work with use-wagmi: [https://wagmi.sh/react/hooks/useAccount](https://wagmi.sh/react/hooks/useAccount).

Wagmi config is in `~/plugins/use-wagmi.ts`. Connectors, available chains and RPC urls can be defined here.

### Error handling

Errors are handled with the global function `userFriendlyMsg` and displayed as toast message with Naive UI. Error messages need to be translated, so error messages are written to `~/locales/en.json`

```js
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
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

### Icons (Icomoon)

To open and edit icons from font Apillon, open (https://icomoon.io/app/#/select) and import file 'assets\css\fonts\apillon\selection.json'.

Control size with font-size and color.

```html
<span class="icon-${iconName} text-xl mr-2"></span>
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
