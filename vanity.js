const cluster = require('cluster');
const forks = require('os').cpus().length;

const api = require('coinkey')
const lookFor = process.argv.slice(2).map(f => f.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''))

console.log('Vanity Wallet Generator');
console.log('')

async function main() {
    if (lookFor.length > 0) {
        console.log('Looking for wallet addresses with keywords at the start/end:')
        lookFor.forEach(k => console.log('   - ', k));
        var re = '^(1|3)(' + lookFor.join('|') + ')(.+)$|^(r.+)(' + lookFor.join('|') + ')$'
        console.log(' ')
        console.log('For the geeks: testing regular expression: ')
        console.log('  ', re)

        const regexp = new RegExp(re, 'i')

        console.log('')
        console.log('\x1b[33m%s\x1b[0m', '-- Press Control C to quit --');
        console.log('')


        for (let i = 0; ; i++) {
            var keypair = new api.createRandom()
            var account = {
                secret: keypair.privateWif,
                address: keypair.publicAddress
            }
            var test = regexp.exec(account.address)
            if (test) {
                var address = ''
                if (test[1] === undefined) {
                    address = test[4] + '\x1b[32m' + test[5] + '\x1b[0m'
                } else {
                    address = test[1] + '\x1b[32m' + test[2] + '\x1b[0m' + test[3]
                }
                process.stdout.write("\n");
                console.log(` > Match: [ ' + ${address} + ' ] with secret [ ' + ${account.secret} + ' ], worker ID- ${cluster.worker.id}`)
            } else {
                if (i % 1000 === 0) process.stdout.write('.')
                if (i % 10000 === 0) process.stdout.write("\r" + i + ' ')
            }
        }

    } else {
        console.log('Please enter one or more keywords after the script to search for.')
        console.log('Eg. "node ' + process.argv[1] + ' johndoe mywallet pepper"')
        console.log('')
        process.exit(0)
    }
}

main();

if (cluster.isMaster) {
    console.log(`I am master, Process ID- ${process.pid}`);
    for (let i = 0; i < forks; i++) {
        cluster.fork();
    }
} else {
    console.log(`I am worker, Process ID- ${process.pid}, worker ID- ${cluster.worker.id}`);
    main()
        .then(() => { process.exit(0) })
        .catch((err)=>{
            console.error(err);
            process.exit(1);
        })
    process.exit(0);
}