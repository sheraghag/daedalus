// @flow
import { ipcMain } from 'electron';
import fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import { get } from 'lodash';
import { appLogsFolderPath, pubLogsFolderPath } from '../config';
import { Logger } from '../utils/logging';
import { COMPRESS_LOGS } from '../../common/ipc-api';
import { stringifyError } from '../../common/utils/logging';

export default () => {
  ipcMain.on(COMPRESS_LOGS.REQUEST, (event, logs, compressedFileName) => {
    const sender = event.sender;
    const outputPath = path.join(appLogsFolderPath, compressedFileName);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });

    output.on('close', () => {
      Logger.debug('COMPRESS_LOGS.SUCCESS');
      return sender.send(COMPRESS_LOGS.SUCCESS, outputPath);
    });

    archive.on('error', (err) => {
      Logger.error('COMPRESS_LOGS.ERROR: ' + stringifyError(err));
      return sender.send(COMPRESS_LOGS.ERROR, err);
    });

    Logger.debug('COMPRESS_LOGS.START');

    // compress files
    const logFiles = get(logs, ['files'], []);
    for (let i = 0; i < logFiles.length; i++) {
      const stream = fs.readFileSync(path.join(pubLogsFolderPath, logFiles[i]));
      archive.append(stream, { name: logFiles[i] });
    }

    archive.finalize((err) => {
      if (err) {
        Logger.error('COMPRESS_LOGS.ERROR: ' + stringifyError(err));
        return sender.send(COMPRESS_LOGS.ERROR, err);
      }
    });

    archive.pipe(output);
  });
};
