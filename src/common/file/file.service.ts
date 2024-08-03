import * as fs from 'fs';
import * as util from 'util';
import * as stream from 'stream';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const pipeline = util.promisify(stream.pipeline);

import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  async upload(file: FileUpload, dirName: string): Promise<string> {
    const { createReadStream, filename } = await file;

    const dir: string =
      this.configService.getOrThrow<string>('PATH_FILES') + dirName;
    const pathName = `${dir}/${uuidv4() + extname(filename)}`;

    try {
      await mkdir(dir, { recursive: true });

      await pipeline(createReadStream, fs.createWriteStream(pathName));

      return pathName;
    } catch (error) {
      await this.delete(pathName);

      throw error;
    }
  }

  async delete(pathFile: string): Promise<boolean> {
    await unlink(pathFile).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });

    return true;
  }
}
