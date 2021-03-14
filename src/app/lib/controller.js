import io from 'socket.io-client';
import SerialController from './serialconnection/controller';

const serialController = new SerialController(io);

export default serialController;
