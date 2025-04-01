import withNuxt from './.nuxt/eslint.config.mjs';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt([
  {
    plugins: { typescriptEslint: typescriptEslint },
    rules: {
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      'vue/no-v-html': 0,
      'vue/singleline-html-element-content-newline': 0,
      'vue/multi-word-component-names': 0,
      'vue/html-indent': 0,
      'vue/max-attributes-per-line': 0,
      'vue/no-multiple-template-root': 0,
      'vue/no-v-model-argument': 0,
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'any',
            normal: 'any',
            component: 'always',
          },
          svg: 'any',
          math: 'always',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'no-console': 0,
    },
  },
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
]);
