import * as net from 'net';
export interface IConnectOptions {
    cipherAlgorithm: string;
    password: string;
    proxySocket: net.Socket;
}
export interface INegotiationOptions extends IConnectOptions {
    dstAddr: string;
    dstPort: number;
}
export declare type IConnectDestinationOptions = INegotiationOptions;
export interface ITransportOptions extends IConnectOptions {
    clientSocket: net.Socket;
}
export interface IConnectExecutor {
    negotiate: (options: INegotiationOptions, finishCallback: (result: boolean, reason?: string) => void) => void;
    connectDestination: (options: IConnectDestinationOptions, finishCallback: (result: boolean, reason?: string) => void) => void;
    transport: (options: ITransportOptions) => void;
}
export interface IPluginGenerator {
    createExecutor?(): IConnectExecutor;
}