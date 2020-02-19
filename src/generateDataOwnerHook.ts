import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Provider,
  createDataProvider,
  addChangeListener,
  removeChangeListener,
} from './Provider';

export function generateDataOwnerHook<T>(data: T) {
  const provider = createDataProvider<T>(data);

  return <K extends keyof T>(
    property: K
  ): [T[K], (val: Provider<T>[K] | ((x: Provider<T>[K]) => Provider<T>[K])) => void] => {
    const [value, setValue] = useState<T[K]>(provider[property]);
    const valueRef = useRef(value);
    valueRef.current = value;

    const updateValue = useCallback(
      (val: Provider<T>[K] | ((x: Provider<T>[K]) => Provider<T>[K])) => {
        if (typeof val === 'function') {
          provider[property] = (val as (x: Provider<T>[K]) => Provider<T>[K])(valueRef.current);
        } else {
          provider[property] = val;
        }
      },
      [property]
    );

    useEffect(() => {
      const callbackFunction = (value: T[K]) => {
        setValue(value);
      };

      addChangeListener(provider, callbackFunction, property);
      return () => removeChangeListener(provider, callbackFunction);
    }, [property]);

    return [value, updateValue];
  };
}
