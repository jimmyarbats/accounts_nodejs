const fs = require('fs');

const chalk = require('chalk');
const inquirer = require('inquirer');

operation()

// init system
function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Bem-vindo ao sistema de gerenciamento de contas, qual serviço você deseja consultar?',
            choices: [
                'Criar uma nova conta',
                'Consultar seu saldo',
                'Realizar um deposito',
                'Realizar um saque',
                'Sair do sistema'
            ],
        },
    ])
    .then((answer) => {
        const action = answer['action']
        
        if (action === 'Criar uma nova conta') {
            createAcc()
        } else if (action === 'Consultar seu saldo') {
            getBalance()
        } else if (action === 'Realizar um deposito') {
            deposit()
        } else if (action === 'Realizar um saque') {
            withdraw()
        } else if (action === 'Sair do sistema') {
            console.log(chalk.bgBlue.black('Obrigado por utilizar o nosso sistema.'))
            process.exit()
        }
    })
    .catch((err) => console.log(err))
}

// create account
function createAcc() {
    console.log(chalk.bgGreen.black('Obrigado por escolher o nosso sistema!'))
    console.log(chalk.green('Defina as opções de conta para prosseguir.'))

    buildAcc()
}

function buildAcc() {
    inquirer.prompt([
        {
            name: 'accName',
            message: 'Escolha um nome de usuario para a sua conta: ',
        },
        {
            name: 'accEmail',
            message: 'Digite seu e-mail: ',
        },
        {
            name: 'accNumber',
            message: 'Digite seu numero de telefone: ',
        },
    ])
    .then((answer) => {
        const accName = answer['accName']
        console.info(accName)

        // verify if accounts folder exists
        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        // verify if account name exists in accounts folder
        if (fs.existsSync(`accounts/${accName}.json`)) {
            console.log(chalk.bgRed.black('Esse usuário já está em uso, escolha um outro nome de usuário.'))
            buildAcc()
            return
        }

        fs.writeFileSync(
            `accounts/${accName}.json`,
            '{"balance": 0}',
            function (err) {
                console.log(err)
            },
        )

        console.log(chalk.green('Sua conta foi criada com sucesso!'))
        operation()
    })
    .catch((err) => console.log(err))
}

// deposit function
function deposit() {
    inquirer.prompt([
        {
            name: "accName",
            message: "Qual o nome de usuario da sua conta? "
        }
    ])
    .then((answer) => {
        const accName = answer['accName']

        // verify if account exists
        if (!checkAcc(accName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual o valor do deposito? ',
            }
        ])
        .then((answer) => {
            const amount = answer['amount']

            // add amount
            addAmount(accName, amount)
            operation()
        })
        .catch((err) => console.log(err))
    })
    .catch(err => console.log(err))
}

function checkAcc(accName) {
    if (!fs.existsSync(`accounts/${accName}.json`)) {
        console.log(chalk.bgRed.black('Essa conta nao esta cadastrada no nosso sistema, escolha outro usuario.'))
        return false
    }

    return true
}

function addAmount(accName, amount) {
    const acc = getAcc(accName)

    if (!amount) {
        console.log(chalk.bgRed.black('Valor invalido, tente novamente. '))
        return deposit()
    }

    acc.balance = parseFloat(amount) + parseFloat(acc.balance)

    fs.writeFileSync(
        `accounts/${accName}.json`,
        JSON.stringify(acc),
        function(err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`R$${amount} foram depositados na sua conta!`))
}

function getAcc(accName) {
    const accJSON = fs.readFileSync(`accounts/${accName}.json`,
    {
        encoding: 'utf8',
        flag: 'r',
    })
    return JSON.parse(accJSON)
}

// show acc balance
function getBalance() {
    inquirer.prompt([
        {
            name: "accName",
            message: "Qual o nome de usuario da sua conta? "
        }
    ])
    .then((answer) => {
        const accName = answer['accName']

        // verify if acc exists
        if (!checkAcc(accName)) {
            return getBalance()
        }

        const acc = getAcc(accName)
        console.log(chalk.bgBlue.black(`Ola, ${accName}, o saldo da sua conta é de R$${acc.balance}`))

        operation()
    })
    .catch(err => console.log(err))
}

// withdraw from user acc
function withdraw() {
    inquirer.prompt([
        {
            name: 'accName',
            message: "Qual o nome de usuario da sua conta? ",
        },
    ])
    .then((answer) => {
        const accName = answer['accName']

        // verify if acc exists
        if (!checkAcc(accName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: "Qual o valor do saque? ",
            },
        ])
        .then((answer) => {
            const amount = answer['amount']
            
            removeAmount(accName, amount)
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
    
}

function removeAmount(accName, amount) {
    const acc = getAcc(accName)

    // verfy if amount is valid
    if (!amount) {
        console.log(chalk.bgRed.black('Ops, ocorreu um erro. Tente novamente. '))
        return withdraw()
    }

    // verify if the user has suficient amount
    if (acc.balance < amount) {
        console.log(chalk.bgRed.black('Você não possui saldo suficiente para essa transação. '))
        return withdraw()
    }

    acc.balance = parseFloat(acc.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accName}.json`,
        JSON.stringify(acc),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Você sacou R$${amount} da conta: ${accName}`))
    
    operation()
}
