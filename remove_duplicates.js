const fs = require('fs');
const inputName = process.argv[2] && process.argv[2]!== '-s' ? process.argv[2] : 'input.txt';
const outputName = process.argv[3] && process.argv[3]!== '-s' ? process.argv[3] : 'output.txt';
if (!fs.existsSync('output')){
    fs.mkdirSync('output');
}
let read = ()=>fs.readFileSync(inputName, 'utf8')
let write = ()=>fs.writeFile('./output/'+outputName, data, function(err) {
	if(err) {
		return console.log(err);
	}
	console.log("The file was saved!");
}); 
let data=read()
data = [...new Set(data.split('\n'))] // Removing duplicates
if(process.argv.includes('-s')){
	data=data.sort()
}
data=data.filter((el)=>el.length>0).join('\n')
write();




 