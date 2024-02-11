'use strict'
function evalInScope(js, contextAsScope = {}) {
	const globalOverride = {
		process: undefined,
		global: undefined,
		require: undefined,
		module: undefined,
		__filename: undefined,
		__dirname: undefined,
		console: undefined,
		setTimeout: undefined,
		setInterval: undefined,
		clearTimeout: undefined,
		clearInterval: undefined,
		setImmediate: undefined,
		clearImmediate: undefined,
		Buffer: undefined,
		import: undefined,
	}
	if (js.match(/import\(.*\)/)) {
		return 'import() is not allowed'
	}
	return String(
		new Function(`
            with (this) { 
                try{
                    return (${js}); 
                } catch(e) {
                    return e.message
                }
            }
        `).call({ ...contextAsScope, ...globalOverride })
	)
}
const args = JSON.parse(Buffer.from(process.argv[2], 'base64').toString('utf-8'))
console.log(evalInScope(args.code, args.scope))
