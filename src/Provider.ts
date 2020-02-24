const addChangeListenerSymbol: unique symbol = Symbol("addChangeListener");
const removeChangeListenerSymbol: unique symbol = Symbol(
  "removeChangeListener"
);

type ProviderListeners<T> = Partial<
  Record<keyof T, ((value: T[keyof T]) => void)[]>
>;
type ProviderData = { [key: string]: any };
export type Provider<T> = {
  [k in keyof T]: T[k];
} & {
  [addChangeListenerSymbol]: Function;
  [removeChangeListenerSymbol]: Function;
};

export function createDataProvider<T extends ProviderData>(
  data: T
): Provider<T> {
  const listeners: ProviderListeners<T> = {};

  function addChangeListener(
    callback: (value: T[keyof T]) => void,
    key: keyof T
  ): void {
    if (!listeners[key]?.includes(callback)) {
      listeners[key] = listeners[key] || [];
      listeners[key]?.push(callback);
    }
  }

  function removeChangeListener(callback: (value: T[keyof T]) => void): void {
    Object.keys(listeners).forEach(key => {
      const index = listeners[key]?.indexOf(callback) ?? -1;
      if (index !== -1) {
        listeners[key]?.splice(index, 1);
      }
    });
  }

  function notify<K extends keyof T>(key: K, value: T[K]) {
    listeners[key]?.forEach(callback => callback(value));
  }

  (data as Provider<T>)[addChangeListenerSymbol] = addChangeListener;
  (data as Provider<T>)[removeChangeListenerSymbol] = removeChangeListener;

  return new Proxy(data as Provider<T>, {
    get(target, property) {
      return Reflect.get(target, property);
    },
    set(target: T, property: keyof T, value) {
      notify(property, value);
      return Reflect.set(target, property, value);
    }
  });
}

export function addChangeListener<T extends Provider<any>, K extends keyof T>(
  provider: T,
  callback: (value: T[K]) => void,
  key: K
) {
  provider[addChangeListenerSymbol](callback, key);
}

export function removeChangeListener<
  T extends Provider<any>,
  K extends keyof T
>(provider: T, callback: (value: T[K]) => void) {
  provider[removeChangeListenerSymbol](callback);
}
