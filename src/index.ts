import express from 'express'
import {readFile} from 'node:fs/promises'
import streamRickRoll from './streamRickRoll'

const app = express();

app.get('/', async (req, res) => {
    const index = await readFile('public/index.html', {encoding: 'utf-8'})
    res.send(index)
})

app.get('/example', async (req, res) => {
    const rickRoll = await streamRickRoll();
    res.send(rickRoll)
})

app.get('/sample', async(req, res) => {
    res.sendFile(`${__dirname}/public/sample.mp4`)
})

app.listen(8080)