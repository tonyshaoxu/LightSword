//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------

'use strict'

require('kinq').enable();
require('async-node');

import { LocalServer } from './socks5/localServer';
import { Socks5Connect } from './socks5/connect';
import { IDispatchReceiver, defaultQueue as DefaultDispatchQueue } from './lib/dispatchQueue';
import * as consts from './socks5/consts';
import { PluginPivot } from './plugins/main';

export class App implements IDispatchReceiver {
  pluginPivot: PluginPivot;
  isLocalProxy: boolean;
  msgMapper: Map<consts.REQUEST_CMD, any>;
  
  constructor(options?) {
    let defaultOptions = {
      addr: 'localhost',
      port: 1080,
      serverAddr: 'localhost',
      serverPort: 23333,
      cipherAlgorithm: 'aes-256-cfb',
      password: 'lightsword.neko',
      socks5Username: '',
      socks5Password: '',
      plugin: 'lightsword',
      timeout: 60
    };
    
    options = options || defaultOptions;
    Object.getOwnPropertyNames(defaultOptions).forEach(n => options[n] = options[n] || defaultOptions[n]);
    
    let isLocalProxy = this.isLocalProxy = ['localhost', '', undefined, null].contains(options.serverAddr.toLowerCase());
    if (isLocalProxy) options.plugin = 'local';
    this.pluginPivot = new PluginPivot(options.plugin);
    
    let msgMapper = new Map();
    msgMapper.set(consts.REQUEST_CMD.CONNECT, Socks5Connect);
    this.msgMapper = msgMapper;
    
    DefaultDispatchQueue.register(consts.REQUEST_CMD.CONNECT, this);
    
    new LocalServer(options).start();
  }
  
  receive(msg: any, args: any) {
    let compoent = this.msgMapper.get(msg);
    if (!compoent) return;
    
    if (this.isLocalProxy) {
      args.serverAddr = args.dstAddr;
      args.serverPort = args.dstPort;
    }
    
    new compoent(this.pluginPivot, args, this.isLocalProxy);
  }
}

if (!module.parent) {
  process.title = 'LightSword Client Debug Mode';
  new App({ serverAddr: '::1' });
}
