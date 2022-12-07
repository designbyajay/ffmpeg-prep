import express from 'express'
import compression from 'compression'
import {readFile, stat} from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import makeStream from './makeStream'

const app = express();

app.use(compression());

app.get('/', async (req, res) => {
    const index = await readFile('public/index.html', {encoding: 'utf-8'})
    res.send(index)
})

app.get('/makestream', async(req, res) => {
    const path = await makeStream();

    console.log(path)
    res.send(path as string)
    // res.end();
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

app.get('/examplestream', async(req, res) => {
    res.sendFile(`${__dirname}/public/sample/master.m3u8`)
})

app.get('/*', async(req,res) => {
    
    res.sendFile(`${__dirname}/public/sample/${req.originalUrl}`)
})
app.listen(8080)