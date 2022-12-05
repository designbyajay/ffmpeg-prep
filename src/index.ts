import express from 'express'
import {readFile, stat} from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import streamRickRoll from './streamRickRoll'

const app = express();

app.get('/', async (req, res) => {
    const index = await readFile('public/index.html', {encoding: 'utf-8'})
    res.send(index)
})

app.get('/makestream', async(req, res) => {
    await streamRickRoll();
    res.status(200)
    res.end();
})

app.get('/example', async (req, res) => {
    const range = req.headers.range
    if(!range) res.status(400).send("requires range header")

    const videoPath = `${__dirname}/public/sample.mp4`
    const videoSize = (await stat(videoPath)).size;

    const [start, end] = (range as string).split("=")[1].split("-").map(s => parseInt(s))
    // const end = Math.min(start + 1000000, videoSize - 1)


    res.status(206).set({
        'Content-Type': 'video/mp4',
        'Content-Length': `${end - start + 1}`,
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${videoSize}`
    })

    const videoStream = createReadStream(videoPath, {start, end})
    // console.log(videoStream)

    for await (const chunk of videoStream){
        res.write(chunk)
    }

    res.end()
})

app.listen(8080)