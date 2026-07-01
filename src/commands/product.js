const fetch = require('node-fetch');

module.exports = (bot) => {
    bot.command('product', async (ctx) => {
        try {
            const apiKey = process.env.FISHY_API_KEY;
            const response = await fetch('https://untruthful-kimi-nonidyllic.ngrok-free.dev/api/telegram-buyer/products', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}` 
                }
            });

            const data = await response.json();

            if (data.success && data.products && data.products.length > 0) {
                // Chỉ lấy những sản phẩm còn hàng (stats.available > 0)
                const availableProducts = data.products.filter(p => p.stats.available > 0);

                if (availableProducts.length === 0) {
                    return ctx.reply("❌ Rất tiếc, hiện tại không có sản phẩm nào còn hàng.");
                }

                let message = "📦 **DANH SÁCH SẢN PHẨM CÒN HÀNG:**\n\n";
                
                availableProducts.forEach(p => {
                    const price = new Intl.NumberFormat('vi-VN').format(p.pricing);
                    message += `🔹 *${p.product_name}*\n`;
                    message += `   💰 Giá: \`${price}đ\` | 📦 SL: \`${p.stats.available}\`\n\n`;
                });

                message += "👉 *Gõ /nap để nạp tiền vào ví.*";
                ctx.reply(message, { parse_mode: 'Markdown' });
            } else {
                ctx.reply("❌ Hiện tại chưa có sản phẩm nào trong kho.");
            }
        } catch (err) {
            console.error("Lỗi API Fishy:", err);
            ctx.reply("❌ Lỗi kết nối đến hệ thống sản phẩm.");
        }
    });
};
