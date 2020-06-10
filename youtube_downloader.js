const fs = require('fs')
const ytdl = require('ytdl-core');
const filenamify = require('filenamify');

let urls=[]
if(process.argv.includes('-f')){
	let fileurl = process.argv[2]!= '-f' ? process.argv[2] : 'input.txt'
	let data = fs.readFileSync(fileurl, 'utf8')
	urls = [...new Set(data.split('\n'))] 
}else{
	let fileurl= process.argv[2].indexOf('youtube')==-1 ? `https://www.youtube.com/watch?v=${process.argv[2]}`:process.argv[2]
	urls.push(fileurl)
}

urls.forEach((url)=>{
	var stream = ytdl(url);
	stream.on('info', (info) => {
		console.log(info.title);   
		console.log(info.video_id);  
		stream
	  .pipe(fs.createWriteStream('./output/'+filenamify(info.title)+'.mp4'));
	});
})

 




 
