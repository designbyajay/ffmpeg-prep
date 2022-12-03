import express from 'express'
import {readFile} from 'node:fs/promises'
import streamRickRoll from './streamRickRoll'

const app = express();

app.get('/', async (req, res) => {
    // const rickRoll = await streamRickRoll();
    const index = await readFile('public/index.html', {encoding: 'utf-8'})
    res.send(index)
})

app.listen(8080)