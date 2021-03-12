const express = require("express");
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.get('/', (req, res) => {
    res.send("Hello, Express");
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
  });

app.get('/burger', (req, res) => {
    res.send("One Burger, coming up!")
})

app.get('/echo', (req, res) =>{
    const responseText = `here are some details of your request:
        Base Url: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) =>{
    console.log(req.query)
    res.send();
});

app.get('/greetings', (req, res) =>{
    const name = req.query.name;
    const race = req.query.race;

    if (!name){
        return res.status(400).send("please provdie a name");
    }

    if(!race){
        return res.status(400).send("Please provide a race");
    }
    const greetings = `Greetings ${name} the ${race}, welcome`;
    res.send(greeting);
})

app.get('/sum', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;

    if (!a || !b){
        return res.status(400).send("Please provide valid entries");
    }
    let sum = parseFloat(a) + parseFloat(b)
    const response = `The sum of ${a} and ${b} is ${sum}`
    res
        .status(200)
        .send(response);
});

app.get('/cipher', (req, res) =>{
    const {text, shift} = req.query;
    if (!text || !shift){
        return res.status(400).send("Please provide valid entries");
    }
    const numShift = parseInt(shift);
    if(Number.isNaN(numShift)) {
        return res
              .status(400)
              .send('shift must be a number');
      }
    
    const base = 'A'.charCodeAt(0);  // get char code 

    const cipher =  text
        .toUpperCase()
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);
            if (code< base || code > (base+26)){
                return char
            }
            let diff = code -base;
            diff = diff+numShift;
            diff = diff%26;
            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;    
        })
        .join('');
    res
        .status(200)
        .send(cipher)
});

app.get('./lotto', (req, res) =>{
    const {numbers} = req.query;
    if(!Array.isarray(numbers)){
        return res.send("array of number is required")
    }
    const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
        if(guesses.length != 6) {
            return res
              .status(400)
              .send("numbers must contain 6 integers between 1 and 20");
        }      
          // fully validated numbers
          // here are the 20 numbers to choose from
          const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);
          //randomly choose 6
          const winningNumbers = [];
        for(let i = 0; i < 6; i++) {
            const ran = Math.floor(Math.random() * stockNumbers.length);
            winningNumbers.push(stockNumbers[ran]);
            stockNumbers.splice(ran, 1);
        }
          //compare the guesses to the winning number
          let diff = winningNumbers.filter(n => !guesses.includes(n));
          // construct a response
          let responseText;
        switch(diff.length){
            case 0: 
              responseText = 'Wow! Unbelievable! You could have won the mega millions!';
              break;
            case 1:   
              responseText = 'Congratulations! You win $100!';
              break;
            case 2:
              responseText = 'Congratulations, you win a free ticket!';
              break;
            default:
              responseText = 'Sorry, you lose';  
        }
          // uncomment below to see how the results ran
          // res.json({
          //   guesses,
          //   winningNumbers,
          //   diff,
          //   responseText
          // });
          res.send(responseText);
       

});

