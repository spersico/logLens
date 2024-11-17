import { onMount } from 'solid-js';
import styles from './NavBar.module.scss';
import { subscribeToRoom } from '../lib/socket';
import { clearLogs, db, filters, setFilters } from '../lib/store';
import { createDexieArrayQuery } from 'solid-dexie';

function debounce(func: Function, timeout = 300) {
  let timer: string | number | NodeJS.Timeout | undefined;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, timeout);
  };
}

export function NavBar() {
  const streams = createDexieArrayQuery(() => db.streams.toArray());

  onMount(() => {
    subscribeToRoom();
  });

  const handleStreamSelection = (event: Event) => {
    const { streamId: oldStreamId } = filters();

    const newValue = (event.target as HTMLSelectElement).value;
    if (newValue === oldStreamId) return;
    const streamId = newValue === '_common_room' ? undefined : newValue;
    setFilters(({ search, autoScroll }) => ({ streamId, search, autoScroll }));
  };

  return (
    <nav class={styles.root}>
      <select onChange={handleStreamSelection}>
        <option value='_common_room'>All Sources</option>
        {streams.map(({ id: stream }: { id: string }) => (
          <option
            class={[
              styles.item,
              filters().streamId === stream ? styles.active : '',
            ]
              .filter(Boolean)
              .join(' ')}
            value={stream}
          >
            {stream}
          </option>
        ))}
      </select>
      <button onClick={clearLogs}>Clear Logs</button>
      <button
        onClick={() =>
          setFilters(({ autoScroll, ...others }) => ({
            ...others,
            autoScroll: !autoScroll,
          }))
        }
      >
        Auto-Scroll {filters().autoScroll ? 'ON' : 'OFF'}
      </button>

      <input
        type='text'
        placeholder='Search'
        onInput={(event) => {
          const newSearch = (event.target as HTMLInputElement).value;
          debounce(() => {
            setFilters(({ search }) => {
              if (search && !newSearch.trim()) {
                return {
                  ...filters(),
                  search: '',
                  autoScroll: true,
                };
              } else if (!search && newSearch.trim()) {
                return {
                  ...filters(),
                  search: newSearch,
                  autoScroll: false,
                };
              }
              return {
                ...filters(),
                search: newSearch,
              };
            });
          })();
        }}
      ></input>
    </nav>
  );
}
