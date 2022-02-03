import Main from '@/src/Main.js'

const main = new Main();
main.start();

['beforeExit', 'SIGUSR1', 'SIGUSR2', 'SIGINT', 'SIGTERM'].map(_ => process.once(_, main.exit.bind(main)));

process.on('unhandledRejection', (err) => main.log.error('PROCESS', 'Unhandled exception:', err));