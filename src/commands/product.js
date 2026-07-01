module.exports = (bot) => {
    bot.command('product', async (ctx) => {
        try {
            const apiKey = process.env.FISHY_API_KEY;
            
            // Gọi API đến bên Fishy
            const response = await fetch('https://untruthful-kimi-nonidyllic.ngrok-free.dev/api/telegram-buyer/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const data = await response.json();

            if (data.success && data.products && data.products.length > 0) {
                let message = "📦 **DANH SÁCH SẢN PHẨM:**\n\n";
                data.products.forEach(p => {
                    // Định dạng giá tiền cho đẹp
                    const price = new Intl.NumberFormat('vi-VN').format(p.pricing);
                    message += `🔹 *${p.product_name}*\n   💰 Giá: ${price}đ | 📦 Còn: ${p.stats.available}\n\n`;
                });
                ctx.reply(message, { parse_mode: 'Markdown' });
            } else {
                ctx.reply("❌ Hiện tại chưa có sản phẩm nào.");
            }
        } catch (err) {
            console.error("Lỗi API Fishy:", err);
            ctx.reply("❌ Lỗi kết nối đến hệ thống sản phẩm.");
        }
    });
};
