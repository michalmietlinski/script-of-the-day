const fs = require('fs')

const create_dir = (dirname) => {
	console.log(dirname)
	const route=dirname.split('/')
	let existsingRoute=route[0]=='.'?route.splice(0,1)+'/':''
	while(route.length!=0){
		const pieceOfRoute=route.splice(0,1)
		existsingRoute+=pieceOfRoute+'/'
		if (!fs.existsSync(existsingRoute)){
			fs.mkdirSync(existsingRoute);
		}
	}
	
}
module.exports = create_dir;


