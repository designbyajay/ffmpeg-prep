import express from 'express'
import streamRickRoll from './streamRickRoll'

const app = express();

app.get('/', async (req, res) => {
    const rickRoll = await streamRickRoll();
    res.send(rickRoll)
})

app.listen(8080)