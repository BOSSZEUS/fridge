const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

// middleware
app.use(express.static(path.join(__dirname, 'public'))) // connects to the public folder
app.use(express.urlencoded({ extended: true })) // use any sized json we want
app.use(express.json()) // lets use send json between the sever and frontend

app.get('/fridge', (req, res) => {
  fs.readFile('./fridge.json', 'utf8', (err, fridge) => {
    if (err) { console.log(err) }
    res.json(JSON.parse(fridge)) // readfile sends back a string. So we need to parse the fridge data so it send back Json.
  })
})
app.get('/fridge/:item', (req, res) => {
  fs.readFile('./fridge.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    const fridge = JSON.parse(data)
    res.json(fridge.filter(food => food.name === req.params.item)[0])
  })
})

app.post('/fridge', (req, res) => {
  fs.readFile('./fridge.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    const fridge = JSON.parse(data)
    fridge.push(req.body)
    fs.writeFile('./fridge.json', JSON.stringify(fridge),
      err => {
        if (err) { console.log(err) }
        res.sendStatus(200)
      })
  })
})

app.listen(process.env.PORT || 3000)
// app.listen(3000) can't use this when sever is deployed to heroku. Must use porocess.env.PORT
// app.listen(3000) // sets app to listen to port 3000 so we can use postman to GET the json information
// app.listen(process.env.PORT) allows heroku to decide what port our app runs on.
