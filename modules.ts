import Module from './modules/_Module.js'
import fs from 'fs/promises'
import channels from './channels.js'
const moduleFiles = await fs.readdir('./modules')
let moduleNames = moduleFiles.map((file) => file.split('.')[0])
moduleNames = moduleNames.filter((name) => !['_Module'].includes(name))
console.log(moduleNames)

const moduleClasses = await Promise.all(
	moduleNames.map((name) => {
		return import(`./modules/${name}.js`) as Promise<{
			default: new (channelName: string) => Module
			scope: string
		}>
	})
).catch(console.error)
if (!moduleClasses) throw new Error('Error loading modules')
const moduleTmp = channels.reduce(
	(acc, channel) => {
		acc[channel.channel] = {}
		return acc
	},
	{ __global: {} }
)
const modules = moduleClasses.reduce((acc, module) => {
	if (module.scope === 'global') {
		acc.__global[module.default.name] = new module.default('__global')
	} else {
		channels.forEach((channel) => {
			acc[channel.channel][module.default.name] = new module.default(channel.channel)
		})
	}
	return acc
}, moduleTmp) as {
	[channel: string]: {
		[module: string]: Module
	}
}
export default modules

export function callAllModules(method: string, ...args: any[]) {
	for (const channel in modules) {
		for (const module in modules[channel]) {
			modules[channel][module][method]?.(...args)
		}
	}
}
export function callChannelModules(method: string, channel: string, ...args: any[]) {
	if (channel[0] == '#') channel = channel.slice(1)
	for (const module in modules[channel]) {
		modules[channel][module][method]?.(...args)
	}
}
export function callGlobalModules(method: string, ...args: any[]) {
	for (const module in modules.__global) {
		modules.__global[module][method]?.(...args)
	}
}

export function getModule<T>(channel: string, moduleClass: new (channelName: string) => T) {
	if (channel[0] == '#') channel = channel.slice(1)
	const module = modules[channel][moduleClass.name]
	return module as T
}
export function getGlobalModule<T>(moduleClass: new (channelName: string) => T) {
	const module = modules.__global[moduleClass.name]
	return module as T
}
