# HyperAPI Core

[![npm version](https://img.shields.io/npm/v/@hyperapi/core.svg)](https://www.npmjs.com/package/@hyperapi/core)
[![license](https://img.shields.io/npm/l/@hyperapi/core.svg?color=blue)](https://github.com/hyperapi/core/blob/main/LICENSE)

A powerful, type-safe foundation framework for building APIs with minimal boilerplate. HyperAPI Core provides routing, standardized API method modules, validation, and hooks, while leaving the connection to the outside world to be handled by drivers.

## Features

- 🔒 **Type-safe API development** - Get full TypeScript support and inference
- 🧩 **File-based routing** - Automatically generate API endpoints from your file structure
- 🚀 **Driver-based architecture** - Easily adapt to different environments (HTTP, WebSockets, etc.)
- 🔍 **Input validation** - Built-in support for request validation
- 🪝 **Middleware hooks** - Extensible system for authentication, logging, and more

## Installation

```bash
bun i @hyperapi/core
# or with pnpm
pnpm add @hyperapi/core
# or with npm
npm install @hyperapi/core
```

## Quick Start

> [!NOTE]
> HyperAPI Core by itself cannot serve requests: you must use a driver package to connect with the outside world. HyperAPI can work with any protocol through its driver system: [HTTP](https://github.com/hyperapi/driver-http-bun), WebSocket, [Tasq](https://github.com/kirick-ts/tasq), [IPC](https://github.com/hyperapi/driver-ipc), or any custom protocol you create a driver for.

### 1. Set up your API structure

Create a directory to hold your API methods (default: `hyper-api` in your project root):

```
my-project/
├── hyper-api/
│   ├── users.[get].ts
│   ├── users.[post].ts
│   └── products/
│       ├── [id].[get].ts
│       └── search.[get].ts
├── index.ts
└── package.json
```

HyperAPI uses file names to determine routes and HTTP methods:

- `users.ts` → `GET /users`
- `users.[post].ts` → `POST /users`
- `users/[id].ts` → `GET /users/:id`
- `users/[id].[delete].ts` → `DELETE /users/:id`

### 2. Create your API handlers

Example of a basic endpoint (`hyper-api/hello.[get].ts`):

```typescript
import type { HyperAPIRequest, HyperAPIResponse } from '@hyperapi/core';
import * as v from 'valibot';

// Define your handler function
export default function(request: HyperAPIRequest<ReturnType<typeof argsValidator>>): HyperAPIResponse {
  return {
    message: `Hello, ${request.args.name}!`,
    timestamp: new Date().toISOString()
  };
}

// Define input validation
export const argsValidator = v.parser(
  v.strictObject({
    name: v.string('Name is required'),
  })
);
```

### 3. Initialize HyperAPI

```typescript
import { HyperAPI } from '@hyperapi/core';
import { SomeHttpDriver } from '@hyperapi/some-http-driver'; // functional driver

// Create a driver instance
const driver = new SomeHttpDriver({ port: 3000 });

// Initialize HyperAPI with the driver
const hyperApiCore = new HyperAPI({
  driver,
  // Optional: custom root path for API methods
  // root: path.join(import.meta.dir, 'api')
});

console.log('API server running on http://localhost:3000');
```

## Request Pipeline

HyperAPI Core processes requests through a well-defined sequence of steps:

1. *Driver* creates a [request](src/request.ts#L6) and passes it to the *Core*
2. *Core* executes all registered `onBeforeRouter` hooks with request it received from the *Driver*
3. *Core* uses a file router to match the request path and method to a module file
   - If no match is found, a [`HyperAPIUnknownMethodError`](src/api-errors.ts#L30) is thrown
4. *Core* merges arguments received from the driver with arguments extracted from the request path by the file router
5. *Core* imports the matched module file dynamically
6. If `argsValidator` is defined, *Core* calls it to validate the request arguments. Returned value is set as new request arguments value
   - If `argsValidator` throws, a [`HyperAPIInvalidParametersError`](src/api-errors.ts#L12) is thrown
7. *Core* calls registered `setRequestTransformer` hook to update request with developer-defined transformations.
8. *Core* executes all registered `onBeforeExecute` hooks with request and module
9. *Core* calls the module's `export default function` with the request object
10. *Core* executes all registered `onResponse` hooks with request it received from the *Driver*, modified request, module, and response received from the module
11. Finally, *Core* passes the response back to the *Driver*, which sends it to the client.

If an error occurs at any steps from 2 to 9, the pipeline short-circuits to the step 10. Before executing step 10, *Core* sets [`HyperAPIInternalError`](src/api-errors.ts#L18) as a response, if error occurred before is not instance of `HyperAPIError`.

## Input Validation

HyperAPI has built-in support for input validation using libraries like [valibot](https://github.com/fabian-hiller/valibot):

```typescript
import * as v from 'valibot';

export const argsValidator = v.parser(
  v.strictObject({
    id: v.number('ID must be a number'),
    email: v.string([v.email('Invalid email format')]),
    tags: v.optional(v.array(v.string())),
  })
);
```

In general, you define `argsValidator` function that throws if validation fails and returns a valid object if the input is correct. But validation library is your choice.

## Hooks and Middleware

HyperAPI provides several hooks for extending functionality at different stages of the request pipeline. Every type of hook executed in parallel, so be careful when changing request object there and avoid race conditions.

### `beforeRouter` hook

Executed after path normalization but before route matching. Use for logging, request inspection, or early validation.

```typescript
hyperApiCore.onBeforeRouter((driver_request) => {
  console.log(`Incoming request: ${driver_request.method} ${driver_request.path}`);

  // Verify request integrity, implement rate limiting, etc.
  if (isRateLimited(driver_request)) {
    throw new HyperAPIRateLimitError();
  }
});
```

### `requestTransformer` hook

Executed after module loading and argument validation, but before module execution. Can access both driver request and module.

This hook can be set only once.

> [!TIP]
> This is the only hook that can change the request type, allowing you to add custom properties or modify existing ones.
>
> For example, if module exports `auth = true` property, you can validate token and add user information to the request object.

```typescript
hyperApiCore.setRequestTransformer((driver_request, module) => {
  return {
    ...driver_request,
    user: module.auth
      ? getCurrentUser(driver_request)
      : null,
  };
});
```

### `beforeExecute` hook

Executed before the module's default export function runs.

```typescript
hyperApiCore.onBeforeExecute((request, module) => {
  // Runs after transformation, with the final request object
  // Perfect for authorization checks based on both request and module
  if (module.auth && !isAuthorized(request, module.auth)) {
    throw new HyperAPIUnauthorizedError();
  }
});
```

### `onResponse` hook

Executed before returning response to driver. Receives all context from the request lifecycle.

This hook has access to both the original driver request and the transformed request. Also, errors thrown from this hook will not change the response.

```typescript
hyperApiCore.onResponse((driver_request, request, module, response) => {
  // Has access to both original driver request and transformed request
  // Useful for metrics, logging, and response modification
  if (request) {
    const duration = Date.now() - request.startTime;
    console.log(`${request.method} ${request.path} completed in ${duration}ms`);
  }
});
```

## Error Handling

HyperAPI provides built-in error type [`HyperAPIError`](src/error.ts) for standardized error handling. If you want to return an error from your module, you can throw an instance of `HyperAPIError` or its subclasses.

```typescript
import { HyperAPIError } from '@hyperapi/core';

// for example, you create custom error for limiting access to some API methods
class HyperAPIAccessDeniedError extends HyperAPIError {
  // mandatory: specify numeric API code greater than 100
  override code = 101;
  // mandatory: specify text description
  override description = 'Access to this API method is denied';
  // optional: specify object with additional information to return
  override data: { foo: 'bar' };
  // optional: specify HTTP status code
  override httpStatus = 403; // Forbidden
  // optional: specify HTTP headers
  override httpHeaders = {
    'X-Access-Denied': '1',
  };
}
```

Now you can throw this error from your module or hooks. Drivers will automatically convert it to a proper response based on their protocols.

HyperAPI provides several [built-in error classes](src/api-errors.ts) for common scenarios like unauthorized access, invalid parameters, and internal errors. You can import them right from the package.

## Custom Drivers

HyperAPI is designed to work with any transport layer or protocol through drivers. This separation of concerns allows you to implement your API once and use it across multiple protocols without changing your business logic.

## TypeScript Support

HyperAPI is built with TypeScript and provides excellent type inference:

```typescript
// Define custom request type
interface MyRequest extends HyperAPIRequest<MyArgs> {
  user: {
    id: string;
    roles: string[];
  }
}

// Define custom module interface
interface MyModule extends HyperAPIModule<MyRequest> {
  auth: boolean;
  roles?: string[];
}

// Initialize with type parameters
const hyperApiCore = new HyperAPI<
  typeof myDriver,
  MyRequest,
  MyModule
>({
  driver: myDriver
});
```

## Contributing

Issues and pull requests are welcome at [our GitHub repository](https://github.com/hyperapi/core).
