import BaziConverter from 'bazi-converter/BaziConverter.js'

import * as http from 'http';

http.createServer(function(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    // this is not allowing all domain, should be restricted to my own FE domain in the future
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE"
  });
  try{
    const d = req.url.split("/")
    console.log(d);
    // need to check format
    let bazi = new BaziConverter(d[1],d[2],d[3],d[4]);
    res.write(JSON.stringify(bazi.getBaziJson()), "utf8", () => { 
      console.log("Result..." + JSON.stringify(bazi.getBaziJson()));
    });
  } catch(e) {
    // handle
    console.log(e);
  }
  res.end();
}).listen(8080);

// //returns { year: '癸酉', month: '丁巳', day: '辛卯', time: '戊戌' }
// console.log(bazi.getBaziJson())

// /* returns the English mapping of the Bazi result
//     {
//       year: 'Metal Rooster',
//       month: 'Fire Snake',
//       day: 'Wood Rabbit',
//       time: 'Earth Dog'
//     }
// */
// console.log(bazi.translateBaziEnglish());

// //returns 癸酉年丁巳月辛卯日戊戌时
// console.log(bazi.getBaziChineseFullString());