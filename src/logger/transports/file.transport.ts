import { writeFileSync } from 'fs';
import { join } from 'path';
import { Transport, TransportOptions, TransportPayload } from './transport';

type LOG_ROTATION = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface FileTransportOptions extends TransportOptions {
  path: string;
  logRotation?: LOG_ROTATION;
}

export class FileTransport extends Transport {
  constructor(private readonly fileOptions: FileTransportOptions) {
    super(fileOptions);
  }

  handle({ message }: TransportPayload): void {
    let filePath = this.fileOptions.path;

    if (this.fileOptions.logRotation) {
      const date = new Date();

      if (this.fileOptions.logRotation === 'daily') {
        filePath = join(
          filePath,
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`,
        );
      } else if (this.fileOptions.logRotation === 'weekly') {
        const weekNumber = Math.ceil(date.getDate() / 7);
        filePath = join(filePath, `${date.getFullYear()}-W${weekNumber}.log`);
      } else if (this.fileOptions.logRotation === 'monthly') {
        filePath = join(
          filePath,
          `${date.getFullYear()}-${date.getMonth() + 1}.log`,
        );
      } else if (this.fileOptions.logRotation === 'hourly') {
        filePath = join(
          filePath,
          `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`,
        );
      }
    }

    writeFileSync(filePath, `${message}\n`, { flag: 'a' });
  }
}
