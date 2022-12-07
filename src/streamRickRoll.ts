import { spawn, exec } from 'node:child_process'

const which = async (bin: string) => await new Promise((resolve, reject) => exec(`which ${bin}`, (error, stdout) => {
    if(error) reject(error);
    resolve(stdout)
}))

export default async () => {
    return `${await which('ffmpeg')} ${await which('ffprobe')}`
}
