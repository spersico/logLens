import styles from './LogLine.module.scss';
import { LogMessage } from '../lib/types';

export default function LogLine({
  msg,
  ...otherProps
}: {
  msg: LogMessage;
  [key: string]: any;
}) {
  return (
    <div class={styles.line} {...otherProps} data-index={otherProps.index}>
      <div class={styles.streamId}>{msg.streamId}</div>
      <div class={styles.timestamp}>
        {new Intl.DateTimeFormat('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: 'numeric',
          hour12: false,
        }).format(new Date(msg.timestamp as string))}
      </div>
      <pre class={styles.content} innerHTML={msg.formatted ?? msg.raw} />
    </div>
  );
}
