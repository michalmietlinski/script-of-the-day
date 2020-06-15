const fetch = require("node-fetch");
const request = require('request');
const fs = require('fs');
const create_dir = require('./create_dir.js')
let filesToDownload=[];
const username = "abcd" 

const userFlag = true;
//Move to external module
dir = `./output/reddit/${userFlag?'u/':'r/'}${username}/`
create_dir(dir)


var download = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
	  request(uri).pipe(fs.createWriteStream(dir+filename)).on('close', callback);
	});
  };
  var downloadAll =()=>{
	if(filesToDownload.length==0){
		return
	}
	let t=filesToDownload.splice(0,1)[0]
	console.log('downloading file', t[0], t[1],  ' left: ', filesToDownload.length)
	if(t[0],t[1]){
		download(t[0],t[1], downloadAll)
	}
}
let x=0;
var get_data=(last)=>{
	x++;
fetch(`https://api.reddit.com/${userFlag?'u/':'r/'}${username}/submitted.json?sort=new&t=all&limit=10000${last?'&after='+last:''}`)
  .then(response => response.json())
  .then(response => {
	const lastchild=response.data.children[response.data.children.length-1];
	response.data.children.forEach((el)=>{
		if(el.data.url&&el.data.url.indexOf('jpg')!=-1){
			filesToDownload.push([el.data.url, el.data.author+'--'+el.data.id+'.jpg'])
		}else{
		}
	})
	if(lastchild){
		console.log(lastchild.data.name)
	}
	if(lastchild&&lastchild.data.name){
		get_data(lastchild.data.name)
	}
	x--
  });
}
get_data()
//Refactor to use promise all
let checkTime=()=>{
	if(x==0){
		filesToDownload=filesToDownload.sort((a,b)=>a[0]>b[0])
		filesToDownload=filesToDownload.filter((el,id)=>id==filesToDownload.length-1||el[0]!=filesToDownload[id+1][0])
		downloadAll();

	}else{
		setTimeout(()=>{
			checkTime()
		},1000)
	}
	
}
checkTime()
	