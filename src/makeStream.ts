import { spawn, exec } from 'node:child_process'
import { mkdir, rm, stat, watch } from 'fs/promises'

const which = async (bin: string) => await new Promise((resolve, reject) => exec(`which ${bin}`, (error, stdout) => {
    if(error) reject(error);
    resolve(stdout.trim())
}))

export default async () => {

    let ffmpeg = ''

    try {
        ffmpeg = await which('ffmpeg') as string
    } catch (e) {
        console.error('ffmpeg not found')
    }

    const streamPath = `${__dirname}/public/sample`

    try {
        await stat(streamPath);
        await rm(streamPath, {recursive: true});
        await mkdir(streamPath)
    } catch (e) {
        await mkdir(streamPath, {recursive: true})
    }
    
    const makeHls = spawn(
        ffmpeg,
        [
            // '-stream_loop',
            // '-1',
            '-loglevel',
            `verbose`,
            '-i',
            `${__dirname}/public/sample.mp4`,
            '-filter_complex',
            '[0:v]split=2[v1][v2];[v1]copy[v1out];[v2]scale=w=640:h=360[v2out]',
            '-map','[v1out]','-c:v:0','h264_videotoolbox','-b:v:0','1M','-preset','veryfast','-g','96','-sc_threshold','0',
            '-map','[v2out]','-c:v:1','h264_videotoolbox','-b:v:1','512k','-preset','veryfast','-g','96','-sc_threshold','0',
            '-map','a:0','-c:a:0','aac','-b:a:0','96k','-ac','2',
            '-map','a:0','-c:a:1','aac','-b:a:1','96k','-ac','2',
            '-f','hls','-hls_time','4',
            '-hls_playlist_type','event',
            '-hls_flags','independent_segments',
            '-hls_segment_type','mpegts',
            '-hls_segment_filename','stream_%v_data%02d.ts',
            '-hls_list_size','15',
            '-master_pl_name','master.m3u8',
            '-var_stream_map','v:0,a:0 v:1,a:1','stream_%v.m3u8'
        ],
        // [
        //     '-i',
        //     `${__dirname}/public/sample.mp4`,
        //     `-c:v`,`h264_videotoolbox`,`-b:v`,`1M`,`-preset`,`veryfast`,`-g`,`96`,`-sc_threshold`,`0`,
        //     `-c:a`,`aac`,`-b:a`,`128k`,`-ac`,`2`,
        //     `-f`,`hls`,`-hls_time`,`4`,`-hls_playlist_type`,`event`,`master.m3u8`
        // ],
        {cwd: `${__dirname}/public/sample`}
    )

    makeHls.stderr.on('data', data => console.log(data.toString()))

    const ac = new AbortController();
    const {signal} = ac;

    try {
        const watcher = watch(streamPath, {signal})
        for await (const fileEvent of watcher){
            if(fileEvent.filename === 'master.m3u8') ac.abort()
        }
    } catch (err: any) {
        console.log('the main playlist has been created')
        if(err.name === 'AbortError')
        return `${streamPath}/master.m3u8`
    }


    // for await (const chunk of makeHls.stdout){
    //     console.log(chunk.toString())
    // }
}
