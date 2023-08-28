# `ts-stdlib` Result

##### Ensemble of utility for managing executions that might fail

[![npm version](https://badge.fury.io/js/%40ts-stdlib%2Fresult.svg)](https://badge.fury.io/js/%40ts-stdlib%2Fresult)

## Installation

```bash
npm install @ts-stdlib/result
```

or

```bash
yarn add @ts-stdlib/result
```

## Usage

```typescript
import {runCatching} from "@ts-stdlib/result";

const result = runCatching(() => {
    // do something that might fail
});

if (result.isSuccess) {
    // do something with result.value
}
```

### `catching`

```typescript
import {catching} from "@ts-stdlib/result";

const dangerousFn = (name: string) => {
    // do something that might fail
};

const safeFn = catching(dangerousFn);

const result = safeFn("Federico");
```

### `getOrDefault` and `getOrElse`

```typescript
const length = result
    .map((value) => value.length)
    .getOrDefault(0);
```

```typescript
const length = result
    .map((value) => value.length)
    .getOrElse(() => 0);
```

#### Mix types

```typescript
const length: number | "N/A" = result
    .map((value) => value.length)
    .getOrDefault("N/A");
```

### `recovery`

```typescript
const lengthResult: number = result.recover((e) => {
    if (e instanceof TypeError) {
        return 0;
    }

    if (e instanceof RangeError) {
        return 1;
    }

    return 2;
});

// it's safe to use lengthResult.value here
// becasue we used `recover`
const length: number = lengthResult.value;
```
### `or`

```typescript
const fallbackResult = runCatching(() => "javascript");

const result: Result<string> = runCatching(() => "typescript")
    .or(fallbackResult)
    .map((value) => value.toUpperCase());
```
