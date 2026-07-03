module.exports = (bot) => {
    // Lắng nghe sự kiện khách bấm vào các nút có chữ 'select_'
    bot.action(/select_(.+)/, async (ctx) => {
        try {
            // Lấy ID sản phẩm từ nút bấm (ví dụ: yt1m, canva)
            const productId = ctx.match[1]; 
            
            // Tắt biểu tượng loading (quay vòng tròn) trên nút bấm
            await ctx.answerCbQuery(); 
            
            // Xử lý bước tiếp theo khi khách chọn sản phẩm
            // (Hiện tại mình cho bot trả lời xác nhận, sau này bạn có thể gọi API mua hàng ở đây)
            await ctx.reply(`✅ Bạn đã chọn sản phẩm có mã: **${productId}**\n\nTiến hành đặt hàng hoặc trừ tiền ví tại đây...`, {
                parse_mode: 'Markdown'
            });

        } catch (error) {
            console.error("Lỗi xử lý chọn sản phẩm:", error);
            await ctx.answerCbQuery('❌ Đã xảy ra lỗi, vui lòng thử lại!', { show_alert: true });
        }
    });

    // Lắng nghe nút Quay Lại
    bot.action('main_menu', async (ctx) => {
        await ctx.answerCbQuery();
        
        // Gọi lại menu chính (Bạn có thể sửa text này theo menu của bạn)
        await ctx.reply('Bạn đã quay lại Menu chính. Gõ /product để xem lại sản phẩm.');
    });
};
