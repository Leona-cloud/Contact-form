const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { request } = require('express');


dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('Public'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/Public/contact.html')
});

app.post('/', (req, res)=>{
    console.log(req.body)

    const tranporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            type: "OAuth2",
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: req.payload,
        to: process.env.SMTP_USER,
        subject: `Message from ${req.body.email}: {req.body.subject}`,
        text: req.body.message
    }

    tranporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error)
            return res.send(error)
        }else{
            console.log("Email sent successfully" + info.response)
            res.send('Thanks for your response')
        }
    })
})




app.listen(process.env.PORT || 5000);
console.log('connected')