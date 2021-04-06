/**
 * 类型定义
 */
export enum TYPE {
  Array = '[object Array]',
  Boolean = '[object Boolean]',
  BigInt = '[object BigInt]',
  Date = '[object Date]',
  Error = '[object Error]',
  Function = '[object Function]',
  Number = '[object Number]',
  Null = '[object Null]',
  Math = '[object Math]',
  MediaStream = '[object MediaStream]',
  LocalMediaStream = '[object LocalMediaStream]',
  MediaStreamTrack = '[object MediaStreamTrack]',
  AudioStreamTrack = '[object AudioStreamTrack]',
  VideoStreamTrack = '[object VideoStreamTrack]',
  CanvasCaptureMediaStreamTrack = '[object CanvasCaptureMediaStreamTrack]',
  Object = '[object Object]',
  RegExp = '[object RegExp]',
  String = '[object String]',
  Symbol = '[object Symbol]',
  Undefined = '[object Undefined]',
  Unknown = '[object Unknown]',
  Promise = '[object Promise]'
}

/**
 * 组合类型定义
 */
export const TYPE_COMPOSE: { [key: string]: Array<TYPE> } = {
  UAN: [TYPE.Undefined, TYPE.Null]
};

/**
 * 返回变量的类型
 * @param variable
 */
export function typeOf(variable: unknown): TYPE {
  let type: TYPE;
  if (typeof variable === 'undefined' || variable === undefined) type = TYPE.Undefined;
  else if (variable === null) type = TYPE.Null;
  else type = Object.prototype.toString.call(variable) as TYPE;

  return type;
}

/**
 * 判断变量是否为`typeArray`中的某一个类型
 * @param variable - 待判断的变量
 * @param typeArray - 预选类型
 * @return {boolean} - `variable`的类型存在与`typeArray`中返回`true`，不存在返回`false`
 */
export function typeIs(variable: unknown, ...typeArray: Array<TYPE>): boolean {
  const varType: TYPE = typeOf(variable);
  for (let i: number = typeArray.length; i--;) {
    if (varType === typeArray[i]) return true;
  }
  return false;
}

/**
 * 判断变量类型是否为{@link string}
 * @param variable
 * @param [notNull=true] 是否不允许空字符串, 即 `''`
 */
export function typeIsString(variable: unknown, notNull = true): variable is string {
  return typeIs(variable, TYPE.String) && (notNull ? (variable as string).length > 0 : true);
}

/**
 * 判断变量类型是否为{@link number}
 * @param variable
 * @param [notNaN=true] - 是否不允许变量为{@link NaN}
 */
export function typeIsNumber(variable: unknown, notNaN = true): variable is number {
  return typeIs(variable, TYPE.Number) && (notNaN ? !Number.isNaN(variable) : true);
}

/**
 * 判断变量是否非空, 即变量不为 `undefined` 和 `null`
 * @param variable
 */
export function notUAN(variable: unknown): variable is Exclude<unknown, undefined | null> {
  return !typeIs(variable, ...TYPE_COMPOSE.UAN);
}

/**
 * 判断变量类型是否为{@link function}
 * @param variable
 */
export function typeIsFunction(variable: unknown): variable is (...args: Array<unknown>) => unknown {
  return typeIs(variable, TYPE.Function);
}

/**
 * 判断变量类型是否为 `true`
 * @param variable
 */
export function typeIsTrue(variable: unknown): variable is boolean {
  return typeIs(variable, TYPE.Boolean) && variable as boolean;
}

export function typeIsFalse(variable: unknown): variable is boolean {
  return typeIs(variable, TYPE.Boolean) && !(variable as boolean);
}

export function typeIsMediaStream(variable: unknown): variable is MediaStream {
  return typeIs(variable, TYPE.MediaStream, TYPE.LocalMediaStream);
}

export function typeIsMediaStreamTrack(variable: unknown): variable is MediaStreamTrack {
  return typeIs(
    variable,
    TYPE.MediaStreamTrack,
    TYPE.AudioStreamTrack,
    TYPE.VideoStreamTrack,
    TYPE.CanvasCaptureMediaStreamTrack
  );
}

export function typeIsObject(variable: unknown): variable is Record<string | number, unknown> {
  return typeIs(variable, TYPE.Object);
}

export function typeIsArray(variable: unknown): variable is Array<unknown> {
  return typeIs(variable, TYPE.Array);
}

export function typeIsPromise(variable: unknown): variable is Promise<unknown> {
  return typeIs(variable, TYPE.Promise);
}

export function typeIsDate(variable: unknown, isValid = false): variable is Date {
  return typeIs(variable, TYPE.Date) && (isValid ? !Number.isNaN((variable as Date).getTime()) : true);
}

export function typeIsThrow(variable: unknown, ...typeArray: Array<TYPE>): boolean {
  if (typeIs(variable, ...typeArray)) {
    return true;
  } else {
    throw new Error(`type of variable ${JSON.stringify(variable)} is not ${JSON.stringify(typeArray)}`);
  }
}

export function typeIsThrowMulti(variableParameterArr: Array<[unknown, ...Array<TYPE>]>): boolean {
  if (!typeIsArray(variableParameterArr)) throw new Error('variableParameterArr is not a array');
  let _result = true;

  for (let i = variableParameterArr.length, variableParameter: [unknown, ...Array<TYPE>], result: unknown; i--, variableParameter = variableParameterArr[i];) {
    result = typeIsThrow(...variableParameter);
    if (!typeIsTrue(result)) {
      _result = false;
      break;
    }
  }

  return _result;
}
