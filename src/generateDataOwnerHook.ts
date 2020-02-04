import { useState, useEffect, useCallback } from 'react';
import {
  Provider,
  createDataProvider,
  addChangeListener,
  removeChangeListener,
} from './Provider';

function generateDataOwnerHook<T>(data: T) {
  const provider = createDataProvider<T>(data);

  return <K extends keyof T>(
    property: K
  ): [T[K], (val: Provider<T>[K]) => void] => {
    const [value, setValue] = useState<T[K]>(provider[property]);

    const updateValue = useCallback(
      (val: Provider<T>[K]) => {
        provider[property] = val;
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

export default generateDataOwnerHook;
