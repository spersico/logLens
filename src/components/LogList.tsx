import { createDexieArrayQuery } from 'solid-dexie';

import { createEffect, For } from 'solid-js';
import { createVirtualizedList } from '@doeixd/create-virtualized-list-solid';
import { filters, logFilteringLogic } from '../lib/store';
import LogLine from './LogLine';

const EmptyMessage = () => (
  <p>
    Waiting for a stream of logs to show up.
    <br />
    <a href='https://github.com/kilianc/rtail' style={{ color: 'white' }}>
      Check out the original project docs to see how to pipe some streams.
    </a>
  </p>
);

export function LogList() {
  const logs = createDexieArrayQuery(logFilteringLogic);
  const vList = createVirtualizedList({
    data: () => logs,
    determineKey: (item, index) => item?.id || (index as number),
    estimateSize(index) {
      // 30px for baseline, plus 15px per line. TODO: this should be dynamic.
      return 30 + logs[index].lineCount * 15;
    },
  });

  const scrollToBottom = () => {
    const containerRef = vList.rootRef();

    if (containerRef && filters().autoScroll) {
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  };

  createEffect(() => {
    filters().autoScroll;
    logs.length;
    console.log(`🐛 | createEffect | logs.length:`, logs.length);

    scrollToBottom();
  });

  return (
    <div {...vList.root}>
      <div {...vList.container}>
        <For each={vList.item} fallback={<EmptyMessage />}>
          {vList.items(
            (item) => (
              <LogLine
                msg={item.data}
                {...item.props}
                index={item.virtualItem.index}
              />
            ),
            true
          )}
        </For>
      </div>
    </div>
  );
}
// 1445 w + (10x2 padding) - 195 h + (10x2 padding) = 1465w x 215h
