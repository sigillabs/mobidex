import { stringify } from 'qs';
import { fetchWithTiming } from './timing';

export async function getActiveServerTransactions(id) {
  const json = fetchWithTiming(
    'Transactions',
    `https://mobidex.io/relayer/transactions/${id}`
  );

  // console.debug('Transactions', `https://mobidex.io/relayer/transactions/${id}`);
  // console.debug('Transactions', json);
  return json;
}

export async function createActiveServerTransactions(data) {
  const body = stringify({ data });
  const response = await fetch(
    'https://mobidex.io/relayer/transactions/queue',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body
    }
  );
  const json = await response.json();
  return json;
}
