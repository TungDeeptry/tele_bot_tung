const fetch = require('node-fetch');
const { Markup } = require('telegraf');

module.exports = (bot) => {
    bot.command('product', async (ctx) => {
        try {
            const apiKey = process.env.FISHY_API_KEY;
            const response = await fetch('https://untruthful-kimi-nonidyllic.ngrok-free.dev/api/telegram-buyer/products', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            const data = await response.json();

            if (data.success && data.products) {
                // Tạo danh sách nút bấm, mỗi nút là một dòng
                const buttons = data.products.map(p => [
                    Markup.button.callback(`✨ ${p.product_name} ✨`, `select_${p._id}`)
                ]);
                
                // Thêm nút "Quay lại"
                buttons.push([Markup.button.callback('◀️ Quay Lại', 'main_menu')]);

                // Gửi tin nhắn với phong cách chuyên nghiệp
                ctx.reply(
                    '👑 F I S H Y M A R K E T 👑\n' +
                    '✨ ———— DANH MỤC DỊCH VỤ ———— ✨\n\n' +
                    'Vui lòng chọn nhóm dịch vụ bạn quan tâm bên dưới:',
                    Markup.inlineKeyboard(buttons)
                );
            }
        } catch (err) {
            console.error(err);
            ctx.reply("❌ Lỗi hệ thống.");
        }
    });
};
