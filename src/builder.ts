import { BaseResult, Failure, Result, Success } from "@/model/Result";

class BaseResultImpl<T> implements BaseResult<T> {
  isSuccess: boolean;
  isFailure: boolean;

  static success<T>(value: T): Success<T> {
    return new BaseResultImpl(value) as Success<T>;
  }

  static failure(exception: unknown): Failure {
    return new BaseResultImpl(undefined as never, exception) as Failure;
  }

  private constructor(
    public value?: T,
    public exception?: unknown,
  ) {
    this.isSuccess = exception === undefined;
    this.isFailure = !this.isSuccess;
  }

  private _isSuccess(): this is Success<T> {
    return this.isSuccess;
  }

  getOrDefault<R>(defaultValue: R) {
    return this._isSuccess() ? this.value : defaultValue;
  }

  getOrElse<R>(onFailure: (e: unknown) => R) {
    return this._isSuccess() ? this.value : onFailure(this.value);
  }

  getOrThrow(): T {
    if (this._isSuccess()) {
      return this.value;
    }

    throw this.exception;
  }

  fold<R>(onSuccess: (value: T) => R, onFailure: (e: unknown) => R) {
    return this._isSuccess()
      ? onSuccess(this.value)
      : onFailure(this.exception);
  }

  map<R>(transform: (value: T) => R) {
    if (!this._isSuccess()) {
      return this as unknown as Failure;
    }

    const transformed = transform(this.value);
    return BaseResultImpl.success(transformed);
  }

  mapCatching<R>(transform: (value: T) => R) {
    try {
      return this.map(transform);
    } catch {
      return BaseResultImpl.failure(this.exception);
    }
  }

  recover<R>(transform: (e: unknown) => R): Success<T> | Success<R> {
    if (this._isSuccess()) {
      return this;
    }

    const transformed = transform(this.exception);
    return BaseResultImpl.success(transformed);
  }

  recoverCatching<R>(transform: (e: unknown) => R) {
    try {
      return this.recover(transform);
    } catch {
      return BaseResultImpl.failure(this.exception);
    }
  }

  or<R>(other: Result<R>): Result<T> | Result<R> {
    return this._isSuccess() ? this : other;
  }

  toString() {
    return this._isSuccess()
      ? `Success(${this.value})`
      : `Failure(${this.exception})`;
  }
}

export const success: <T>(value: T) => Success<T> = BaseResultImpl.success;

export const failure: (exception: unknown) => Failure = BaseResultImpl.failure;
