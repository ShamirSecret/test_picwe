export function truncateString(str: string, frontLength: number = 14, endLength: number = 4): string {
  if (!str) {
    return ''
  }
  if (str.length <= frontLength + endLength) {
    return str; // 如果字符串长度不够，直接返回原字符串
  }
  const front = str.slice(0, frontLength);
  const end = str.slice(-endLength);
  return `${front}...${end}`;
}

/**
 * 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
 */
export function isNumber(val: any) {
  var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
  var regNeg =
    /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true
  } else {
    return false
  }
}

/**
 * 浮点数位数处理，默认保留2位小数
 * @param {Number} f 需要处理的参数
 * @param {Number} digit 保留的小数点位数
 * @return {Number}
 */
export function decFloat(f: any, digit = 6) {
  if (isNumber(f)) {
    const m = Math.pow(10, digit)
    return parseInt(decMul(f, m, -1), 10) / m
  } else {
    return 0
  }
}
/**
 * 加法
 * @param {Number} num1 加数
 * @param {Number} num2 加数
 * @param {Number} digit 保留位数，默认保留两位小数， 传入-1为高精度计算
 * @returns {Number} 返回相加后的结果
 */
export function decAdd(num1: any, num2: any, digit: any = 6): number {
  if (isNumber(num1) && isNumber(num2)) {
    const num1Digits = (num1.toString().split('.')[1] || '').length
    const num2Digits = (num2.toString().split('.')[1] || '').length
    const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits)) // 放大倍数baseNum是‘两个小数点后面长度这两者之间的最大值’
    const calcValue = (decMul(num1, baseNum) + decMul(num2, baseNum)) / baseNum
    if (digit === -1) {
      return calcValue
    } else {
      return decFloat(calcValue, digit)
    }
  } else {
    return 0
  }
}

/**
 * 减法
 * @param {Number} num1 被减数
 * @param {Number} num2 减数
 * @param {Number} digit 保留位数，默认保留两位小数， 传入-1为高精度计算
 * @returns {Number} 返回相减后的结果
 */
export function decSub(num1: any = 0, num2: any = 0, digit: any = 6): number {
  if (isNumber(num1) && isNumber(num2)) {
    const num1Digits = (num1.toString().split('.')[1] || '').length
    const num2Digits = (num2.toString().split('.')[1] || '').length
    const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits)) // 放大倍数baseNum是‘两个小数点后面长度这两者之间的最大值’
    const calcValue = (decMul(num1, baseNum) - decMul(num2, baseNum)) / baseNum
    if (digit === -1) {
      return calcValue
    } else {
      return decFloat(calcValue, digit)
    }
  } else {
    return 0
  }
}
/**
 * 乘法
 * @param {Number} num1 乘数
 * @param {Number} num2 乘数
 * @param {Number} digit 保留位数，默认保留两位小数， 传入-1为高精度计算
 * @returns {Number} 返回相乘后的结果
 */
export function decMul(num1: any = 0, num2: any = 0, digit: any = 6): any {
  if (isNumber(num1) && isNumber(num2)) {
    const num1String = num1.toString()
    const num2String = num2.toString()
    const num1Digits = (num1String.split('.')[1] || '').length
    const num2Digits = (num2String.split('.')[1] || '').length
    const baseNum = Math.pow(10, num1Digits + num2Digits) // 放大倍数baseNum是‘两个小数点后面长度之和’

    const calcValue =
      (Number(num1String.replace('.', '')) *
        Number(num2String.replace('.', ''))) /
      baseNum
    if (digit === -1) {
      return calcValue
    } else {
      return decFloat(calcValue, digit)
    }
  } else {
    return 0
  }
}

/**
 * 除法
 * @param {Number} num1 被除数
 * @param {Number} num2 除数
 * @param {Number} digit 保留位数，默认保留两位小数， 传入-1为高精度计算
 * @returns {Number} 返回相除后的结果
 */
export function decDiv(num1: any = 0, num2: any = 0, digit: any = 6): number {
  if (isNumber(num1) && isNumber(num2)) {
    const num1String = num1.toString()
    const num2String = num2.toString()
    const num1Digits = (num1String.split('.')[1] || '').length
    const num2Digits = (num2String.split('.')[1] || '').length
    const baseNum = Math.pow(10, num1Digits + num2Digits) // 放大倍数baseNum是‘两个小数点后面长度之和’
    let n1 = decMul(num1, baseNum)
    let n2 = decMul(num2, baseNum)

    const calcValue = Number(n1) / Number(n2)
    if (digit === -1) {
      return calcValue
    } else {
      return decFloat(calcValue, digit)
    }
  } else {
    return 0
  }
}

import bigDecimal from 'js-big-decimal';
/** bigInt乘法 */
export function bigMul(val: number | string | bigint | undefined | null, val2: number | string | bigint | undefined | null, decimalPlaces: number = 8) {
  if (!isValidNumber(val) || !isValidNumber(val2)) return '0';

  const n1 = new bigDecimal(val);
  const n2 = new bigDecimal(val2);
  const result = n1.multiply(n2);
  console.log('result', result)
  return result.value;
}

/** bigInt除法 第一个参数除以第二个参数 */
export function bigDiv(val: number | string | bigint | undefined | null, val2: number | string | bigint | undefined | null, decimalPlaces: number = 8) {
  if (!isValidNumber(val) || !isValidNumber(val2) || val2 === 0) return '0';

  const n1 = new bigDecimal(val);
  const n2 = new bigDecimal(val2);
  const result = n1.divide(n2);
  return formatResult(result.value, decimalPlaces);
}

/** 检查输入是否为有效数字 */
function isValidNumber(value: any): value is number | string | bigint {
  return typeof value === 'number' || typeof value === 'string' || typeof value === 'bigint';
}

/** 格式化结果，去掉小数点后多余的0，并支持保留小数位数 */
function formatResult(value: string, decimalPlaces: number): string {
  if (!value || isNaN(Number(value))) return '0';

  // 限制小数位
  const [intPart, decimalPart = ''] = value.split('.');
  const limitedDecimal = decimalPart.slice(0, decimalPlaces);
  const result = limitedDecimal
    ? `${intPart}.${limitedDecimal}`
    : intPart;

  // 去掉末尾多余的 0 和小数点
  return result.replace(/\.?0+$/, '');
}