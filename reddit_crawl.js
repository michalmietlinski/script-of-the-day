const fetch = require("node-fetch");
const request = require('request');
const fs = require('fs');
const create_dir = require('./create_dir.js')
let filesToDownload=[];
const username =  ['abc'] 

const userFlag = true;
let x=0; //Pending downloads ount;

var download = function(uri, filename, dir, callback){
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
		download(t[0],t[1],t[2], downloadAll)
	}
}
const get_data=(username, userFlag, dir, last)=>{
	x++;
fetch(`https://api.reddit.com/${userFlag?'u/':'r/'}${username}/submitted.json?sort=new&t=all&limit=10000${last?'&after='+last:''}`)
  .then(response => response.json())
  .then(response => {
	const lastchild=response.data.children[response.data.children.length-1];
	response.data.children.forEach((el)=>{
		if(el.data.url&&el.data.url.indexOf('jpg')!=-1){
			filesToDownload.push([el.data.url, el.data.author+'--'+el.data.id+'.jpg', dir])
		}else if(el.data.preview && el.data.preview.reddit_video_preview){
			filesToDownload.push([el.data.preview.reddit_video_preview.fallback_url,el.data.author+'--'+el.data.id+'.mp4', dir])
		}
	})
	if(lastchild&&lastchild.data.name&&lastchild.data.name.length>4){
		console.log('Fetching next batch for: ', username)
		get_data(username,userFlag, dir, lastchild.data.name)
		console.log("filesToDownload", filesToDownload.length)
	}
	x--
  });
}
const run_single_task = ()=>{
	let el = username.splice(0,1)
	console.log('Running tasks: ',el)
	dir = `./output/reddit/${userFlag?'u/':'r/'}${el}/`
	create_dir(dir)
	get_data(el, userFlag, dir)
}

let checkTime=()=>{
	if(x==0){
		
		console.log(username.length, filesToDownload.length)
		if(username.length>0){
			run_single_task()
			checkTime()
		}else{
			filesToDownload=filesToDownload.sort((a,b)=>a[0]>b[0])
			filesToDownload=filesToDownload.filter((el,id)=>id==filesToDownload.length-1||el[0]!=filesToDownload[id+1][0])
			downloadAll();
		}
	}else{
		console.log(x, 'left to go')
		setTimeout(()=>{
			checkTime()
		},1000)
	}
}

checkTime()
	