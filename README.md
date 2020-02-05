# react-data-owner-hook

## Description
This package exports only one method: `generateDataOwnerHook`. This method takes object with initial values as input and returns hook function that will become owner of this structure. Works like `useState` but with state that persists between different components. So all consumers of this hook will share the same data.

Intention for this thing was to create some lightweight data management tool, something without reducers and all those `@observer` things.

Not for big projects.

## Installation
```
$ npm i -s react-data-owner-hook
```

## Usage

### Step 1. Create hook
**hooks/useFilters.ts**:
```ts
import { generateDataOwnerHook } from 'react-data-owner-hook';

export interface Filters {
  name: string;
  status: bool;
  someNumber?: number;
}

const useFilters = generateDataOwnerHook<Filters>({
  name: '',
  status: true,
  someNumber: 0,
});

export default useFilters;
```


### Step 2. Use Hook as usual
**component/SomeComponent.tsx**
```tsx
import React from 'react';

import useFilters from 'hooks/useFilters';


const SomeComponent = () => {
  // types of all values are taken from Filters interface

  // status type is bool, setStatus arg type is bool
  const [status, setStatus] = useFilters('status');

  // name type is bool, setName arg type is bool
  const [name, setName] = useFilters('name');

  // someNumber type is number | undefined, arg type is
  // number | bool
  const [someNumber, setSomeNumber] = useFilters('someNumber');


  return (
    // You can use it as usual hook
    ...
  );
};
```

### Step 3. Use in more places. State will be shared
**component/TotallyAnotherComponent.tsx**
```tsx
import React from 'react';

import useFilters from 'hooks/useFilters';


const TotallyAnotherComponent = () => {
  // value of status here and in SomeComponent will be the
  // same. On change of status value, both components will
  // rerender with new value.
  const [status, setStatus] = useFilters('status');


  return (
    // You can use it as usual hook
    ...
  );
};
```
