const fetch = require('node-fetch');
const { Markup } = require('telegraf');

module.exports = (bot) => {
    bot.command('product', async (ctx) => {
        try {
            const apiKey = process.env.FISHY_API_KEY;
            
            if (!apiKey) {
                return ctx.reply("❌ Lỗi cấu hình: Chưa có API Key.");
            }

            // Gọi API lấy sản phẩm
            const response = await fetch('https://untruthful-kimi-nonidyllic.ngrok-free.dev/api/telegram-buyer/products', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}` 
                }
            });

            const data = await response.json();

            // Nếu lấy dữ liệu thành công và có sản phẩm
            if (data.success && data.products && data.products.length > 0) {
                
                // Lọc các sản phẩm còn hàng (nếu bạn muốn hiện cả SP hết hàng thì bỏ dòng filter này đi)
                const availableProducts = data.products.filter(p => p.stats.available > 0);

                if (availableProducts.length === 0) {
                    return ctx.reply("❌ Rất tiếc, hiện tại không có sản phẩm nào còn hàng.");
                }

                // Tạo mảng chứa các nút bấm (mỗi nút 1 dòng)
                const buttons = availableProducts.map(p => {
                    const price = new Intl.NumberFormat('vi-VN').format(p.pricing);
                    const buttonText = `✨ ${p.product_name} - ${price}đ ✨`;
                    
                    // Nút gửi về ID của sản phẩm (VD: select_yt1m)
                    return [Markup.button.callback(buttonText, `select_${p._id}`)];
                });
                
                // Thêm nút "Quay Lại" xuống dưới cùng của danh sách
                buttons.push([Markup.button.callback('◀️ Quay Lại', 'main_menu')]);

                // Gửi tin nhắn kèm bảng nút bấm
                ctx.reply(
                    '👑 F I S H Y M A R K E T 👑\n' +
                    '✨ ———— DANH MỤC DỊCH VỤ ———— ✨\n\n' +
                    'Vui lòng chọn nhóm dịch vụ bạn quan tâm bên dưới:',
                    Markup.inlineKeyboard(buttons)
                );
            } else {
                ctx.reply("❌ Hiện tại chưa có sản phẩm nào trong kho.");
            }
        } catch (err) {
            console.error("Lỗi API Fishy:", err);
            ctx.reply("❌ Đã xảy ra lỗi kết nối đến hệ thống.");
        }
    });
};
