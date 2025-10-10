/**
 * 健康指标参考标准配置
 * 用于判断各项检查指标是否在正常范围内
 */

export const healthStandards = {
  // 血常规检查
  blood: {
    '白细胞计数': {
      unit: '×10⁹/L',
      min: 4.0,
      max: 10.0,
      optimal: 6.5,
      icon: '○',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    },
    '红细胞计数': {
      unit: '×10¹²/L',
      min: 4.0,
      max: 5.5,
      optimal: 4.7,
      icon: '◉',
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
    },
    '血红蛋白': {
      unit: 'g/L',
      min: 120,
      max: 160,
      optimal: 140,
      icon: '◆',
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
    },
    '血小板': {
      unit: '×10⁹/L',
      min: 100,
      max: 300,
      optimal: 200,
      icon: '◇',
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
    },
    '血细胞比容': {
      unit: '%',
      min: 37,
      max: 50,
      optimal: 43,
      icon: '▢',
      gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
    },
    '中性粒细胞': {
      unit: '%',
      min: 50,
      max: 70,
      optimal: 60,
      icon: '◎',
      gradient: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)'
    },
    '淋巴细胞': {
      unit: '%',
      min: 20,
      max: 40,
      optimal: 30,
      icon: '◐',
      gradient: 'linear-gradient(135deg, #FEE140 0%, #FA709A 100%)'
    }
  },

  // 肝功能检查
  liver: {
    '谷丙转氨酶': {
      unit: 'U/L',
      min: 0,
      max: 40,
      optimal: 20,
      icon: '▸',
      gradient: 'linear-gradient(135deg, #81FBB8 0%, #28C76F 100%)'
    },
    '谷草转氨酶': {
      unit: 'U/L',
      min: 0,
      max: 40,
      optimal: 20,
      icon: '▹',
      gradient: 'linear-gradient(135deg, #FFA3B6 0%, #FF6A88 100%)'
    },
    '总胆红素': {
      unit: 'μmol/L',
      min: 3.4,
      max: 20.5,
      optimal: 12,
      icon: '◆',
      gradient: 'linear-gradient(135deg, #FFAB40 0%, #FF6F00 100%)'
    },
    '直接胆红素': {
      unit: 'μmol/L',
      min: 0,
      max: 6.8,
      optimal: 3,
      icon: '◇',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    },
    '总蛋白': {
      unit: 'g/L',
      min: 60,
      max: 80,
      optimal: 70,
      icon: '○',
      gradient: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)'
    },
    '白蛋白': {
      unit: 'g/L',
      min: 35,
      max: 55,
      optimal: 45,
      icon: '◉',
      gradient: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)'
    }
  },

  // 肾功能检查
  kidney: {
    '尿素氮': {
      unit: 'mmol/L',
      min: 2.9,
      max: 7.1,
      optimal: 5,
      icon: '◆',
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
    },
    '肌酐': {
      unit: 'μmol/L',
      min: 44,
      max: 133,
      optimal: 88,
      icon: '◇',
      gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
    },
    '尿酸': {
      unit: 'μmol/L',
      min: 150,
      max: 420,
      optimal: 285,
      icon: '○',
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
    }
  },

  // 血脂检查
  lipid: {
    '总胆固醇': {
      unit: 'mmol/L',
      min: 2.8,
      max: 5.7,
      optimal: 4.2,
      icon: '◆',
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
    },
    '甘油三酯': {
      unit: 'mmol/L',
      min: 0.4,
      max: 1.7,
      optimal: 1,
      icon: '◇',
      gradient: 'linear-gradient(135deg, #FFAB40 0%, #FF6F00 100%)'
    },
    '高密度脂蛋白': {
      unit: 'mmol/L',
      min: 1.0,
      max: 2.5,
      optimal: 1.5,
      icon: '○',
      gradient: 'linear-gradient(135deg, #81FBB8 0%, #28C76F 100%)'
    },
    '低密度脂蛋白': {
      unit: 'mmol/L',
      min: 0,
      max: 3.4,
      optimal: 2.6,
      icon: '◉',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    }
  },

  // 血糖检查
  glucose: {
    '空腹血糖': {
      unit: 'mmol/L',
      min: 3.9,
      max: 6.1,
      optimal: 5,
      icon: '◆',
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
    },
    '餐后2小时血糖': {
      unit: 'mmol/L',
      min: 3.9,
      max: 7.8,
      optimal: 5.8,
      icon: '◇',
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
    },
    '糖化血红蛋白': {
      unit: '%',
      min: 4.0,
      max: 6.0,
      optimal: 5,
      icon: '○',
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
    }
  },

  // 甲状腺功能
  thyroid: {
    'TSH': {
      unit: 'mIU/L',
      min: 0.27,
      max: 4.2,
      optimal: 2.2,
      icon: '◆',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    },
    'T3': {
      unit: 'nmol/L',
      min: 1.3,
      max: 3.1,
      optimal: 2.2,
      icon: '◇',
      gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
    },
    'T4': {
      unit: 'nmol/L',
      min: 66,
      max: 181,
      optimal: 123,
      icon: '○',
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
    }
  },

  // 尿常规
  urine: {
    '尿蛋白': {
      unit: '',
      min: 0,
      max: 0,
      optimal: 0,
      icon: '◆',
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      isQualitative: true,
      normalValue: '阴性'
    },
    '尿糖': {
      unit: '',
      min: 0,
      max: 0,
      optimal: 0,
      icon: '◇',
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
      isQualitative: true,
      normalValue: '阴性'
    },
    '尿酮体': {
      unit: '',
      min: 0,
      max: 0,
      optimal: 0,
      icon: '○',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      isQualitative: true,
      normalValue: '阴性'
    },
    '尿比重': {
      unit: '',
      min: 1.003,
      max: 1.030,
      optimal: 1.015,
      icon: '◉',
      gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
    }
  },

  // 心电图
  ecg: {
    '心率': {
      unit: '次/分',
      min: 60,
      max: 100,
      optimal: 75,
      icon: '♥',
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
    },
    'PR间期': {
      unit: 'ms',
      min: 120,
      max: 200,
      optimal: 160,
      icon: '◆',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    },
    'QRS时限': {
      unit: 'ms',
      min: 60,
      max: 100,
      optimal: 80,
      icon: '◇',
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
    },
    'QT间期': {
      unit: 'ms',
      min: 350,
      max: 440,
      optimal: 395,
      icon: '○',
      gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
    }
  },

  // 血压
  blood_pressure: {
    '收缩压': {
      unit: 'mmHg',
      min: 90,
      max: 140,
      optimal: 120,
      icon: '♥',
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
    },
    '舒张压': {
      unit: 'mmHg',
      min: 60,
      max: 90,
      optimal: 80,
      icon: '♡',
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
    }
  }
}

/**
 * 根据指标名称和数值判断健康状态
 * @param {string} name - 指标名称
 * @param {number|string} value - 指标数值
 * @param {string} category - 指标分类（可选）
 * @returns {Object} 包含状态、状态文本、进度百分比等信息
 */
export function evaluateHealthMetric(name, value, category = null) {
  // 查找指标标准
  let standard = null
  let foundCategory = category

  if (category && healthStandards[category] && healthStandards[category][name]) {
    standard = healthStandards[category][name]
  } else {
    // 自动查找
    for (const cat in healthStandards) {
      if (healthStandards[cat][name]) {
        standard = healthStandards[cat][name]
        foundCategory = cat
        break
      }
    }
  }

  if (!standard) {
    return {
      status: 'unknown',
      statusText: '未知',
      statusColor: '#999',
      progress: 50,
      icon: '○',
      gradient: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
    }
  }

  // 处理定性指标（如尿蛋白阴性/阳性）
  if (standard.isQualitative) {
    const isNormal = value === standard.normalValue || value === '阴性' || value === '-'
    return {
      status: isNormal ? 'normal' : 'abnormal',
      statusText: isNormal ? '正常' : '异常',
      statusColor: isNormal ? '#37CD87' : '#FF5252',
      progress: isNormal ? 100 : 0,
      icon: standard.icon,
      gradient: standard.gradient,
      min: standard.min,
      max: standard.max,
      optimal: standard.optimal,
      unit: standard.unit
    }
  }

  // 处理定量指标
  const numValue = parseFloat(value)
  const { min, max, optimal } = standard
  
  let status = 'normal'
  let statusText = '正常'
  let statusColor = '#37CD87'
  let progress = 0

  if (numValue < min) {
    status = 'low'
    statusText = '偏低'
    statusColor = '#4FACFE'
    // 进度条显示：越低进度越小
    progress = Math.max(0, (numValue / min) * 40) // 0-40%范围
  } else if (numValue > max) {
    status = 'high'
    statusText = '偏高'
    statusColor = '#FFAB40'
    // 进度条显示：越高进度越大
    const overRange = numValue - max
    const maxOverRange = max * 0.5 // 假设最高不超过参考上限的150%
    progress = 60 + Math.min(40, (overRange / maxOverRange) * 40) // 60-100%范围
  } else {
    status = 'normal'
    statusText = '正常'
    statusColor = '#37CD87'
    // 进度条显示：在正常范围内，越接近最优值进度越接近50%
    const range = max - min
    const position = numValue - min
    progress = 40 + (position / range) * 20 // 40-60%范围，最优值在中间
  }

  // 极端情况调整
  if (numValue >= max * 1.5) {
    status = 'danger'
    statusText = '严重偏高'
    statusColor = '#FF5252'
    progress = 100
  } else if (numValue <= min * 0.5 && min > 0) {
    status = 'danger'
    statusText = '严重偏低'
    statusColor = '#FF5252'
    progress = 0
  }

  return {
    status,
    statusText,
    statusColor,
    progress,
    icon: standard.icon,
    gradient: standard.gradient,
    min,
    max,
    optimal,
    unit: standard.unit
  }
}

/**
 * 计算整体健康评分
 * @param {Array} metrics - 健康指标数组
 * @returns {number} 健康评分（0-100）
 */
export function calculateHealthScore(metrics) {
  if (!metrics || metrics.length === 0) return 0

  let totalScore = 0
  let normalCount = 0
  let warningCount = 0
  let dangerCount = 0

  metrics.forEach(metric => {
    const evaluation = evaluateHealthMetric(metric.name, metric.value, metric.category)
    
    if (evaluation.status === 'normal') {
      totalScore += 100
      normalCount++
    } else if (evaluation.status === 'low' || evaluation.status === 'high') {
      totalScore += 70
      warningCount++
    } else if (evaluation.status === 'danger') {
      totalScore += 40
      dangerCount++
    } else {
      totalScore += 60
    }
  })

  return Math.round(totalScore / metrics.length)
}

export default {
  healthStandards,
  evaluateHealthMetric,
  calculateHealthScore
}

