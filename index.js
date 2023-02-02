#! /usr/bin/env node
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import { Customer } from "./customer.js";
import { DisplayInfo, ShowAccountBalance, Credit, Debit, TransactionHistory } from "./customerOptions.js";
const sleep = () => new Promise((r) => setTimeout(r, 2000));
console.log(chalk.bold.rgb(204, 204, 204)(`\n   <<<=================================>>>`));
console.log(chalk.bold.rgb(204, 204, 204)(`<<<===========>>>  ${chalk.redBright.bold('MY BANK')}  <<<===========>>>`));
console.log(chalk.bold.rgb(204, 204, 204)(`   <<<=================================>>>\n`));
let customers = [];
async function Choice() {
    const { option } = await inquirer.prompt([{
            name: "option",
            message: 'What Would You Like To Do ?',
            type: 'list',
            choices: [{ name: 'Create New Account', value: 'C' }, { name: 'Sign In', value: 'S' }]
        }]);
    return option;
}
async function CreateNewAccount() {
    let Names;
    (function (Names) {
        Names["Name"] = "Name";
        Names["Age"] = "Age";
        Names["ContactNumber"] = "Contact Number";
        Names["Pin"] = "Pin";
        Names["UserID"] = "UserID";
    })(Names || (Names = {}));
    async function Inputs(name, type) {
        while (true) {
            const { input } = await inquirer.prompt([{
                    name: 'input',
                    message: `Enter Your ${name} : `,
                    type: type
                }]);
            if (!input) {
                continue;
            }
            if (name === Names.ContactNumber) {
                let numRegex = /^(\+92|0|92)[0-9]{10}$/;
                if (!numRegex.test(input)) {
                    console.log(chalk.redBright(`  Use Pakistani Number`));
                    continue;
                }
            }
            if (name === Names.UserID) {
                let customer = customers.filter((val) => val.userId === input);
                if (customer.length) {
                    console.log(chalk.redBright(`  This UserID Is Already Taken Try Different`));
                    continue;
                }
            }
            return input;
        }
    }
    let name = await Inputs(Names.Name, 'string');
    let age = await Inputs(Names.Age, 'number');
    let contactNumber = await Inputs(Names.ContactNumber, 'string');
    let pin = await Inputs(Names.Pin, 'number');
    let userId = await Inputs(Names.UserID, 'string');
    let customer = new Customer(name, age, contactNumber, pin, userId);
    let spinner = createSpinner('Creating Account').start();
    await sleep();
    customers.push(customer);
    spinner.success({ text: chalk.whiteBright.bgRgb(0, 125, 17)(' Account Created Successfully ') });
}
async function SignIn() {
    const { userID, pin } = await inquirer.prompt([
        {
            name: 'userID',
            message: "Enter Your UserID : ",
        },
        {
            name: 'pin',
            message: 'Enter Your Pin : ',
            type: 'number'
        }
    ]);
    let customer = customers.find((val) => val.userId === userID);
    let spinner = createSpinner('Signing In').start();
    await sleep();
    if (!customer) {
        spinner.error({ text: chalk.whiteBright.bgRed(` No Customer With This UserID`) });
        return;
    }
    else {
        if (customer.pin !== pin) {
            spinner.error({ text: chalk.whiteBright.bgRed(` Incorrect PIN`) });
            return;
        }
        spinner.success({ text: chalk.whiteBright.bgRgb(0, 125, 17)('Signed In Successfully') });
        console.log(chalk.whiteBright(`\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n`));
        while (true) {
            const { userChoice } = await inquirer.prompt([{
                    name: 'userChoice',
                    message: 'Make Your Choice',
                    type: 'rawlist',
                    choices: ['Show Profile', 'Debit', 'Credit', 'Account Balance', 'Transaction History']
                }]);
            switch (userChoice) {
                case 'Show Profile':
                    DisplayInfo(customer);
                    break;
                case 'Account Balance':
                    ShowAccountBalance(customer);
                    break;
                case 'Credit':
                    await Credit(customer);
                    break;
                case 'Debit':
                    await Debit(customer);
                    break;
                case 'Transaction History':
                    TransactionHistory(customer);
                    break;
                default:
                    break;
            }
            const { choice } = await inquirer.prompt([
                {
                    name: 'choice',
                    message: 'Select One: ',
                    type: "list",
                    choices: ['Perform Another Task', 'Sign Out']
                }
            ]);
            if (choice === 'Sign Out') {
                console.log(chalk.whiteBright(`\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n`));
                break;
            }
            else {
                console.log(chalk.whiteBright(`\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n`));
                continue;
            }
        }
    }
}
while (true) {
    let choice = await Choice();
    if (choice === 'C') {
        await CreateNewAccount();
    }
    else if (choice === 'S') {
        await SignIn();
    }
    // EXIT PROGRAM CHOICE
    const input = await inquirer.prompt([
        {
            name: chalk.rgb(255, 255, 160)(`Do You Want To Exit?`),
            type: "confirm",
            default: false
        }
    ]);
    let value = await input['\x1B[38;2;255;255;160mDo You Want To Exit?\x1B[39m'];
    if (value) {
        break;
    }
    console.log(chalk.whiteBright('\n================================================================'));
    console.log(chalk.whiteBright('================================================================\n'));
}
