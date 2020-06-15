const fs = require('fs')
let create_dir
if (require.main === module) {
	create_dir = (()=>{
		if(!process.argv[2]){
			console.log( 'No directory passed')
			return
		}
		const route=process.argv[2].split('/')
		console.log(route)
		let existsingRoute=route[0]=='.'?route.splice(0,1)+'/':''
		while(route.length!=0){
			const pieceOfRoute=route.splice(0,1)
			existsingRoute+=pieceOfRoute+'/'
			if (!fs.existsSync(existsingRoute)){
				fs.mkdirSync(existsingRoute);
			}
		}
	})()
}else{
	create_dir = (dirname) => {
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
}
module.exports = create_dir;


