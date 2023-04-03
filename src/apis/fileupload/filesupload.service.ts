import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
import { v4 as uuidv4 } from 'uuid';

const getToday = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  return `${yyyy}/${mm}/${dd}`;
};

interface IUpload {
  files: FileUpload[];
}

@Injectable()
export class FilesUploadService {
  async upload({ files }) {
    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles);

    const storage = new Storage({
      projectId: 'f10-team01-server-372805',
      keyFilename: '/my-secret/gcp-file-storage.json',
    }).bucket('f10-teamproject-storage');

    const results = await Promise.all(
      waitedFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const fname = `${getToday()}/${uuidv4()}/origin/${file.filename}`;
          file
            .createReadStream()
            .pipe(storage.file(fname).createWriteStream())
            .on('finish', () =>
              resolve(`${'f10-teamproject-storage'}/${fname}`),
            )
            .on('error', (error) => reject(error));
        });
      }),
    );
    console.log(results);
    return results;
  }

  async uploadOne({ file }) {
    const storage = new Storage({
      projectId: 'f10-team01-server-372805',
      keyFilename: '/my-secret/gcp-file-storage.json',
    }).bucket('f10-teamproject-storage');

    return new Promise<string>((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(file.filename).createWriteStream())
        .on('finish', () => resolve(`f10-teamproject-storage/${file.filename}`))
        .on('error', () => reject('실패'));
    });
  }
}
