export interface BaseResult<T> {
  isSuccess: boolean;
  isFailure: boolean;
  value?: T;
  exception?: unknown;

  getOrDefault: <R>(defaultValue: R) => T | R;
  getOrElse: <R>(onFailure: (e: unknown) => R) => T | R;
  getOrThrow: () => T;

  fold: <R>(onSuccess: (value: T) => R, onFailure: (e: unknown) => R) => R;
  map: <R>(transform: (value: T) => R) => Result<R>;
  mapCatching: <R>(transform: (value: T) => R) => Result<R>;

  recover: <R>(transform: (e: unknown) => R) => Success<T> | Success<R>;
  recoverCatching: <R>(transform: (e: unknown) => R) => Result<T> | Result<R>;

  or: <R>(other: Result<R>) => Result<T> | Result<R>;
}

export interface Success<T> extends BaseResult<T> {
  isSuccess: true;
  isFailure: false;
  value: T;
}

export interface Failure extends BaseResult<never> {
  isSuccess: false;
  isFailure: true;
  exception: unknown;
}

export type Result<T> = Success<T> | Failure;
