import { useCallback, useEffect, useState } from 'react';

export function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem(key)) ?? initialValue; }
    catch { return initialValue; }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export function useFetch(request) {
  const [state, setState] = useState({ data: null, loading: false, error: '' });
  const execute = useCallback(async (...args) => {
    setState({ data: null, loading: true, error: '' });
    try {
      const data = await request(...args);
      setState({ data, loading: false, error: '' });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
      throw error;
    }
  }, [request]);
  return { ...state, execute };
}

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const update = useCallback((event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value })), []);
  const reset = useCallback((nextValues = initialValues) => setValues(nextValues), [initialValues]);
  return { values, setValues, update, reset };
}
