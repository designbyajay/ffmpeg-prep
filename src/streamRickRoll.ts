import { spawn, exec } from 'node:child_process'

const which = async (bin: string) => await new Promise((resolve, reject) => exec(`which ${bin}`, (error, stdout) => {
    if(error) reject(error);
    resolve(stdout)
}))

export default async () => {
    // const diagnostics = []
    // diagnostics.push(`${await which('ffmpeg')} ${await which('ffprobe')}`)

    // return diagnostics.reduce((acc, curr) => `${acc}\n${curr}`)

    return '/sample'
    
}
