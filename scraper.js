var http = require('follow-redirects').http;
const fs = require('fs');
const request = require('request');


var url = require('url');
var adr = '';


var q = url.parse(adr, true);

var dir = `./${q.host.indexOf('www')!=-1 ? q.host.split('.')[1] : q.host.split('.')[0]}`;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
console.log(q.host)

if(q.query&&q.query.lid){
	dir+=`/${q.query.lid}`
}else{
	let no= q.path.split('/').filter(el=>el.length>0)
	dir+=`/${no[no.length-1]}`
}
console.log(q.query)

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
var options = {
    host: q.host,
    path: q.path
}
let filesToDownload=[];
var download = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
	  request(uri).pipe(fs.createWriteStream(dir+'/'+filename)).on('close', callback);
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
var parse =(str)=>{
	//srcset=
	const r = /(src=|href=)[\'"]{1}[a-zA-Z0-9:\/\-._]+/gm;
	fs.appendFile(dir+'/'+'content.txt', str,()=>{});
	let m;
	let g=[]
	while ((m = r.exec(str)) !== null) {
    if (m.index === r.lastIndex) {
        r.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
		if(match.indexOf('http')!=-1 &&
		(match.indexOf('png')!=-1||match.indexOf('jpg')!=-1)){
		g.push(match.replace("\"","").replace("\'","").replace('src=','').replace('srcset=','').replace('href=','')
		.replace('-273x410','').replace('-615x410','').replace('-272x410','').replace('-618x410',''))
		
		}else{
			// TEMP FOR non html urls;
			g.push('https://'+q.host+q.path+match.replace('href=\"',''))
		}
	});
}
console.log(g)
	g=g.filter((el)=>el.indexOf('http')!=-1&&(el.indexOf('jpg')!=-1||el.indexOf('JPG')!=-1)&&el.indexOf('backup')==-1)
	console.log(g)
	for(let i=0;i<g.length;i++){
		let name=g[i].split('/');
		name=name[name.length-1]
		filesToDownload.push([g[i], i+'_'+name])
	}
	downloadAll();
}
var request2 = http.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
		data += chunk;
    });
    res.on('end', function () {
		parse(data)
    });
});
request2.on('error', function (e) {
    console.log('error', e.message);
});
request2.end();