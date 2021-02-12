const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const inlineAction = require('./tocamosa/inline')
const { Telegraf, Markup } = require('telegraf')

if (process.env.TELEGRAM_BOT_TOKEN === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!')
}

const keyboard = Markup.inlineKeyboard([
  Markup.button.url('❤️', 'http://telegraf.js.org'),
  Markup.button.callback('Delete', 'delete')
])

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard))
bot.action('delete', (ctx) => ctx.deleteMessage())
//bot.launch()

bot.on('inline_query', (ctx) => {
return inlineAction(ctx)
})

exports.handler = async event => {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: '' };
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
