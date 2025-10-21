// 解决 ts 类型warning
import type { Linter } from 'eslint';
// ts 规则
import typescriptEslint from '@typescript-eslint/eslint-plugin';
// ts 解析器
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
// 解决 eslint 和 prettier 的共存问题
import prettier from '@vue/eslint-config-prettier';
import vue from 'eslint-plugin-vue';
// .vue 解析器
import vueParser from 'vue-eslint-parser';
// airbnb 规则
import { configs as airbnbConfigs } from 'eslint-config-airbnb-extended/legacy';
import path from 'node:path';

export default [
  // 1. 忽略文件配置
  {
    ignores: [
      // 从 .eslintignore 迁移的配置
      '/*.json',
      '/*.js',
      '**/dist/**',
      '**/node_modules/**',
      // 其他忽略配置
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/build/**',
    ],
  },
  // 2. TypeScript 推荐配置
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
    },
  },

  // 3. Vue 3 推荐配置 (基础配置先加载)
  ...vue.configs['flat/recommended'],

  // 4. Airbnb 基础配置
  // 下面的抽象操作时让规则对 vue 文件生效
  // 原谅我的炫技，不过确实很简洁
  ...airbnbConfigs.base.recommended.map((rule) => ({
    ...rule,
    files: rule.files.some((s) => s.includes('ts'))
      ? [...rule.files, '**/*.vue']
      : rule.files,
  })),

  // 5. 自定义配置和规则覆盖 (最后加载以覆盖之前的规则)
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'import': importPlugin,
      vue,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // browser
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // node
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        // vue setup compiler macros
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        defineModel: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(__dirname, './tsconfig.json'),
        },
      },
    },
    rules: {
      // 基础规则
      'no-console': 1,
      'no-debugger': 0, // 开发环境可以使用,生产环境需要启用
      'no-param-reassign': 0,
      'no-nested-ternary': 0,
      'prefer-regex-literals': 0,
      'camelcase': 0,
      'no-undef': 0, // 临时解决 defineModel 问题

      // Vue 规则覆盖
      'vue/require-default-prop': 0,
      'vue/singleline-html-element-content-newline': 0,
      'vue/max-attributes-per-line': 0,
      'vue/multi-word-component-names': 0,
      'vue/no-useless-template-attributes': 0,
      'vue/custom-event-name-casing': [2, 'camelCase'],
      'vue/no-v-text': 1,
      'vue/padding-line-between-blocks': 1,
      'vue/require-direct-export': 1,

      // TypeScript 规则覆盖
      '@typescript-eslint/ban-ts-comment': 0, // 允许 @ts-ignore
      // 解决莫名其妙的，对于 函数参数未使用 的报错
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 1,
      '@typescript-eslint/no-empty-function': 1,
      '@typescript-eslint/no-explicit-any': 0,
      'no-shadow': 0, // 避免 enum 的循环引用
      '@typescript-eslint/no-shadow': 2,

      // Import 规则
      'import/extensions': [
        2,
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-extraneous-dependencies': 0,
      'import/prefer-default-export': 0,
    },
  },
  // Prettier 配置 (必须放在最后以禁用所有格式化相关的 ESLint 规则)
  prettier,
] as Linter.Config[];
