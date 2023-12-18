const meta = {
  title: 'Apillon - Web3 development platform',
  description: 'Robust infrastructure for developers. Few-click solutions for everyone else.',
  url: 'https://app.apillon.io/',
  image: 'https://app.apillon.io/apillon_og.jpg',
};

export default defineNitroPlugin((nitroApp: any) => {
  nitroApp.hooks.hook('render:html', (html: any) => {
    html.head.push(
      `<title>${meta.title}</title>
      <meta name="description" content="${meta.description}">

      <!-- Facebook Meta Tags -->
      <meta property="og:url" content="${meta.url}">
      <meta property="og:type" content="website">
      <meta property="og:title" content="${meta.title}">
      <meta property="og:description" content="${meta.description}">
      <meta property="og:image" content="${meta.image}">

      <!-- Twitter Meta Tags -->
      <meta name="twitter:card" content="summary_large_image">
      <meta property="twitter:domain" content="${meta.url}">
      <meta property="twitter:url" content="${meta.url}">
      <meta name="twitter:title" content="${meta.title}">
      <meta name="twitter:description" content="${meta.description}">
      <meta name="twitter:image" content="${meta.image}">`
    );
  });
});
