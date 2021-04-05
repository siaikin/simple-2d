/* eslint-disable */

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
  UnKnown = '[object Unknown]',
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
export function typeOf(variable: any): TYPE {
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
export function typeIs(variable: any, ...typeArray: Array<TYPE>): boolean {
  const varType: TYPE = typeOf(variable);
  for (let i: number = typeArray.length; i--;) {
    if (varType === typeArray[i]) return true;
  }
  return false;
}

/**
 * 判断变量类型是否为{@link string}
 * @param variable
 * @param [notNull=true] - 是否不允许空字符串, 即 `''`
 */
export function typeIsString(variable: any, notNull = true): variable is string {
  return typeIs(variable, TYPE.String) && (notNull ? variable.length > 0 : true);
}

/**
 * 判断变量类型是否为{@link number}
 * @param variable
 * @param [notNaN=true] - 是否不允许变量为{@link NaN}
 */
export function typeIsNumber(variable: any, notNaN = true): variable is number {
  return typeIs(variable, TYPE.Number) && (notNaN ? !Number.isNaN(variable) : true);
}

/**
 * 判断变量是否非空, 即变量不为 `undefined` 和 `null`
 * @param variable
 */
export function notUAN(variable: any): variable is any {
  return !typeIs(variable, ...TYPE_COMPOSE.UAN);
}

/**
 * 判断变量类型是否为{@link function}, 同名函数为{@link isFunction}
 * @param variable
 */
export function typeIsFunction(variable: any): variable is Function {
  return typeIs(variable, TYPE.Function);
}

/**
 * 判断变量类型是否为 `true`, 同名函数为{@link isTrue}
 * @param variable
 */
export function typeIsTrue(variable: any): variable is boolean {
  return typeIs(variable, TYPE.Boolean) && variable;
}

export function typeIsFalse(variable: any): variable is boolean {
  return typeIs(variable, TYPE.Boolean) && !variable;
}

export function typeIsMediaStream(variable: any): variable is MediaStream {
  return typeIs(variable, TYPE.MediaStream, TYPE.LocalMediaStream);
}

export function typeIsMediaStreamTrack(variable: any): variable is MediaStreamTrack {
  return typeIs(
    variable,
    TYPE.MediaStreamTrack,
    TYPE.AudioStreamTrack,
    TYPE.VideoStreamTrack,
    TYPE.CanvasCaptureMediaStreamTrack
  );
}

export function typeIsObject(variable: any): variable is Object {
  return typeIs(variable, TYPE.Object);
}

export function typeIsArray(variable: any): variable is Array<any> {
  return typeIs(variable, TYPE.Array);
}

export function typeIsPromise(variable: any): variable is Promise<any> {
  return typeIs(variable, TYPE.Promise);
}

export function typeIsDate(variable: any, isValid = false): variable is Date {
  return typeIs(variable, TYPE.Date) && (isValid ? !Number.isNaN(variable.getTime()) : true);
}

export function typeIsThrow(variable: any, ...typeArray: Array<TYPE>): Boolean | Error {
  if (typeIs(variable, ...typeArray)) {
    return true;
  } else {
    return new Error(`type of variable ${JSON.stringify(variable)} is not ${JSON.stringify(typeArray)}`);
  }
}

export function typeIsThrowMulti(variableParameterArr: Array<[any, ...Array<TYPE>]>): {accept?: boolean, error?: Error} {
  if (!typeIsArray(variableParameterArr)) return {error: new Error('variableParameterArr is not a array')};

  for (let i = variableParameterArr.length, variableParameter: [any, ...Array<TYPE>], result: any; i--, variableParameter = variableParameterArr[i];) {
    result = typeIsThrow(...variableParameter);
    if (!typeIsTrue(result)) return {accept: false, error: result};
  }

  return {accept: true};
}

/**
 * 深度比较两个变量是否相同
 * 允许的比较类型: boolean, null, undefined, number, string, object, array
 * @param variable
 * @param other
 */
export function equals(variable: any, other: any): boolean {
  const varType = typeOf(variable), otherType = typeOf(other);
  let result = true;

  if (varType !== otherType) result = false;
  else {
    if (varType === TYPE.Array) {
      if (variable.length !== other.length) result = false;
      else {
        for (let i = 0; i < variable.length; i++) {
          if (!equals(variable[i], other[i])) {
            result = false;
            break;
          }
        }
      }
    } else if (varType === TYPE.Object) {
      const
      varKeys = Object.keys(variable),
      otherKeys = Object.keys(other);
      if (varKeys.length !== otherKeys.length) result = false;
      else {
        for (let i = varKeys.length; i--;) {
          if (varKeys[i] !== otherKeys[i] || !equals(variable[varKeys[i]], other[otherKeys[i]])) {
            result = false;
            break;
          }
        }
      }
    } else {
      switch (varType) {
        case TYPE.Boolean:
        case TYPE.Null:
        case TYPE.Number:
        case TYPE.String:
        case TYPE.Undefined:
          result = Object.is(variable, other);
          break;
        default:
          result = false;
          throw new Error('complex type detected! only support simple type (e.g boolean, null, undefined, number, string, object, array).')
      }
    }
  }

  return result;
}

/**
 * @param target
 */
export function clone(target: any): any {
  const targetType = typeOf(target);
  let result: any;

  switch (targetType) {
    case TYPE.Object:
      result = {};
      const varKeys = Object.keys(target);
      for (let i = 0; i < varKeys.length; i++) {
        result[varKeys[i]] = clone(target[varKeys[i]]);
      }

      break;
    case TYPE.Array:
      result = [];
      for (let i = 0; i < target.length; i++) {
        result.push(clone(target[i]));
      }
      break;
    case TYPE.String:
    case TYPE.Number:
    case TYPE.Boolean:
    case TYPE.Null:
    case TYPE.Undefined:
    case TYPE.Function:
      result = target;
      break;
    default:
      throw new Error(`complex type detected! only support simple type (e.g boolean, null, undefined, number, string, object, array). but get [${targetType}] type`)
  }

  return result;
}

/**
 * 合并两个对象
 * @param target
 * @param source
 */
export function merge<T>(target: T, source: T): T {
  const targetType = typeOf(target), sourceType = typeOf(source);
  let result;

  if (targetType !== sourceType) {
    throw new Error('target type not equal source type!');
  } else {
    switch (sourceType) {
      case TYPE.Object:
      case TYPE.Array:
        result = recursionFunc(clone(target), source);
        break;
      default:
        throw new Error('simple type detected! only support complex type (just only object and array)');
    }
  }

  function recursionFunc(_target: any, _source: any) {
    const targetType = typeOf(_target), sourceType = typeOf(_source), typeEqual = targetType === sourceType;
    if (!typeIsTrue(typeEqual) || (targetType !== TYPE.Object && targetType !== TYPE.Array)) return undefined;

    switch (targetType) {
      case TYPE.Object:
        const _sourceKeys = Object.keys(_source);
        let _tagVal, _tagValType, _srcVal, _srcValType, key;
        for (let i = 0; i < _sourceKeys.length; i++) {
          key = _sourceKeys[i];
          _tagVal = _target[key];
          _tagValType = typeOf(_tagVal);
          _srcVal = _source[key];
          _srcValType = typeOf(_srcVal);

          if (_tagValType === _srcValType) {
            switch (_srcValType) {
              case TYPE.Object:
              case TYPE.Array:
                _target[key] = merge(_target[key], _source[key]);
                break;
              default:
                _target[key] = _source[key];
            }
          } else if (notUAN(_source[key])) {
            _target[key] = _source[key];
          }
        }
        break;
      case TYPE.Array:
        _target.push(..._source);
        break;
    }

    return _target;
  }

  return result;
}

export const isBrowser = typeof window !== 'undefined';

//@ts-ignore
export const isWeChat = typeof wx !== 'undefined';
