const fs = require('fs');

const chalk = require('chalk');
const inquirer = require('inquirer');

operation()

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

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

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