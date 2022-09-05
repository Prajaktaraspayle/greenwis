const express = require('express')
const cherio = require('cherio');
const bodyParser = require('express')
const request = require('request');
const fs = require('fs');
const https = require('https')
let app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let set = new Set()
// Create a Write Stream 
var WriteStream  = fs.createWriteStream("ImagesLink.txt", "UTF-8");

let x = 'https://www.growpital.com/'

request(x, (err, resp, html)=>{

    if(!err && resp.statusCode == 200){
        console.log("Request was success ");
        
        // Define Cherio or $ Object 
        const $ = cherio.load(html);

        $("img").each((index, image)=>{

            var img = $(image).attr('src');
            if(img.slice(0,4) == 'http'){
                var Links = img
            }else{
                var baseUrl = x;
                var Links = baseUrl + img;
            }
            WriteStream.write(Links);
            WriteStream.write("\n");
            set.add(Links)
        });
    }else{
        console.log(err);
    }
    let images = Array.from(set)
    console.log(images.length)
    for(let i = 0; i < images.length; i++){
        setTimeout(() => {
            var fullUrl = images[i];
            let path = "./uploads/" + Date.now() + ".jpg"
            let localPath = fs.createWriteStream(path);
            let request = https.get(fullUrl, function(response){
            console.log("downloaded successfully",i);
            response.pipe(localPath)
        })
        },1000*i)
    }

});
