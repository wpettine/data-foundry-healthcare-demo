import { useSearchParams } from 'react-router-dom';

export function useUrlParams() {
  const [searchParams] = useSearchParams();
  return {
    demo: searchParams.get('demo'),
    snapshot: searchParams.get('snapshot'),
  };
}
