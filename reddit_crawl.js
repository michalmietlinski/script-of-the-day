const fetch = require("node-fetch");
const request = require('request');
const fs = require('fs');

let filesToDownload=[];
const username = "abcd" 
const userFlag = true;
let dir = `./output/reddit`
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
dir = `./output/reddit/u`
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
dir = `./output/reddit/${userFlag?'u/':'r/'}${username}/`

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var download = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
	  request(uri).pipe(fs.createWriteStream(dir+filename+'.jpg')).on('close', callback);
	});
  };
  var downloadAll =()=>{
	if(filesToDownload.length==0){
		return
	}
	let t=filesToDownload.splice(0,1)[0]
	console.log('downloading file', t[0], t[1])
	if(t[0],t[1]){
		download(t[0],t[1], downloadAll)
	}
}
fetch(`https://api.reddit.com/${userFlag?'u/':'r/'}${username}.json?sort=top&t=all&limit=1000`)
  .then(response => response.json())
  .then(response => {
	response.data.children.forEach((el)=>{
		// console.log(el)
		if(el.data.url&&el.data.url.indexOf('jpg')!=-1){
			filesToDownload.push([el.data.url, el.data.author+'--'+el.data.id])
		}else{
			// console.log(el.data)
		}
	})
	downloadAll();


  });
  
