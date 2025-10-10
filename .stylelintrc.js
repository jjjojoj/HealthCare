module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue'
  ],
  plugins: [
    'stylelint-order'
  ],
  rules: {
    // 允许的单位
    'unit-allowed-list': [
      'px', 'rpx', 'em', 'rem', '%', 'vw', 'vh', 'deg', 's', 'ms'
    ],
    
    // 允许未知的伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global']
      }
    ],
    
    // 允许未知的伪元素
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
      }
    ],
    
    // 允许未知的 @ 规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
          'extend',
          'use'
        ]
      }
    ],
    
    // 不强制要求命名规范
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'keyframes-name-pattern': null,
    
    // 允许空文件
    'no-empty-source': null,
    
    // 允许未知函数
    'function-no-unknown': null,
    
    // 颜色函数表示法
    'color-function-notation': 'legacy',
    
    // 字体族名称引号
    'font-family-name-quotes': 'always-where-recommended',
    
    // 属性排序
    'order/properties-order': [
      // 定位
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      
      // 盒模型
      'display',
      'flex',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'align-content',
      'order',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'grid',
      'grid-template',
      'grid-gap',
      'float',
      'clear',
      'box-sizing',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'overflow',
      'overflow-x',
      'overflow-y',
      
      // 排版
      'color',
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-decoration',
      'text-transform',
      'white-space',
      'word-wrap',
      'word-break',
      
      // 视觉
      'background',
      'background-color',
      'background-image',
      'background-position',
      'background-size',
      'background-repeat',
      'border',
      'border-width',
      'border-style',
      'border-color',
      'border-radius',
      'box-shadow',
      'opacity',
      'visibility',
      
      // 动画
      'transform',
      'transition',
      'animation'
    ]
  }
}

