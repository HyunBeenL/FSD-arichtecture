module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: '순환 의존. 모듈 평가 순서에 기대게 되고 번들러마다 결과가 달라진다',
      from: {},
      to: { circular: true },
    },

    {
      name: 'design-system-is-isolated',
      severity: 'error',
      comment:
        'design-system 이 앱 코드를 참조한다. 별 패키지로 분리할 수 없게 된다. 필요하면 prop 으로 주입받는다',
      from: { path: '^src/design-system/' },
      to: {
        path: '^src/(?!design-system/)',
        pathNot: ['[.]stories[.](ts|tsx)$'],
      },
    },
    {
      name: 'design-system-has-no-data-libs',
      severity: 'error',
      comment:
        'design-system 이 데이터·라우팅 라이브러리를 참조한다. 부품이 이 앱 전용이 되고 다른 화면에 못 쓴다',
      from: {
        path: '^src/design-system/',
        pathNot: ['[.]stories[.](ts|tsx)$'],
      },
      to: {
        dependencyTypes: ['npm'],
        path: '^(next|@tanstack/|react-hook-form|i18next|react-i18next|zustand|zod|axios)',
      },
    },

    {
      name: 'no-dev-dep-in-src',
      severity: 'error',
      comment: '제품 코드가 devDependency 만 보고 부른다. 배포본에서 그 모듈이 없다',
      from: {
        path: '^(src|app)/',
        pathNot: ['[.](stories)[.](ts|tsx)$'],
      },
      to: {
        dependencyTypes: ['npm-dev'],
        dependencyTypesNot: ['npm-peer', 'npm', 'npm-optional'],
      },
    },

    {
      name: 'no-orphans',
      severity: 'warn',
      comment: '아무도 부르지 않는 모듈. 지워도 되는지 확인한다',
      from: {
        orphan: true,
        pathNot: [
          '[.]d[.]ts$',
          '(^|/)[.][^/]+[.](js|cjs|mjs|ts|json)$',
          '(^|/)tsconfig[^/]*[.]json$',
          '(^|/)(next|postcss|eslint|prettier|storybook)[.]config[.](js|cjs|mjs|ts)$',
          '^app/',
          '^(proxy|next-env[.]d)[.]ts$',
          '(^|/)[.]storybook/',
          '[.]stories[.](ts|tsx)$',
        ],
      },
      to: {},
    },
  ],

  options: {
    doNotFollow: { path: 'node_modules' },

    tsPreCompilationDeps: true,

    tsConfig: { fileName: 'tsconfig.json' },

    exclude: {
      path: '(^|/)(dist|[.]next|storybook-static|coverage|node_modules|[.]npm-cache)/',
    },

    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'],
      mainFields: ['module', 'main'],
    },
  },
};
