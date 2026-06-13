const express=require('express');
const fs=require('fs');
const cors=require('cors');
const {GoogleGenerativeAI}=require("@google/generative-ai");

const app=express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(
"AIzaSyCE8Q15rrHpEMAc6SDJuqh_0YN5uwTRwwI"
);

const model = genAI.getGenerativeModel({
model:"gemini-1.5-flash"
});

app.use(cors());

const data=JSON.parse(
fs.readFileSync('./database.json')
);

// Metro API

app.get('/metro',(req,res)=>{

res.json(data.metroRoutes)

});

// Ride API

app.get('/rides',(req,res)=>{

res.json(data.rides)

});

// Language API

app.get('/language',(req,res)=>{

res.json(data.language)

});


app.get('/',(req,res)=>{

res.send("Namma Buddy Backend Running 🚀")

});


app.post("/aiRide",async(req,res)=>{

try{

const {from,to}=req.body;

const prompt=`

You are Namma Buddy AI.

Compare travel options in Bangalore.

From:${from}

To:${to}

Include:

🚇 Metro
🚌 BMTC
🛺 Auto
🚕 Cab
🏍 Bike Taxi

For each give:

- Estimated cost
- Travel time
- Safety score
- Comfort
- Recommendation

Finally recommend the best option with reason.

`;

const result=
await model.generateContent(prompt);

const answer=
result.response.text();

res.json({
answer
});

}

catch(error){

console.log(error);

res.json({

answer:"AI unavailable"

})

}

});
app.listen(

5000,

()=>{

console.log(
"Server running at port 5000"
)

});