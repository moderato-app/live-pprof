import mitt from 'mitt'

export const myEmitter = mitt<{ clearData: undefined }>()
