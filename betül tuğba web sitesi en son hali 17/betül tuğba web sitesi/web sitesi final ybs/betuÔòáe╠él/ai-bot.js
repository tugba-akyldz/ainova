async function soruSor() {
    const soruKutusu = document.getElementById('soruKutusu');
    const cevapAlani = document.getElementById('cevapAlani');
    const text = soruKutusu.value.trim();
    const imageInput = document.getElementById('image-input');
    const imageFile = imageInput.files[0];

    if (!text && !imageFile) return;

    cevapAlani.innerHTML = "⏳ Lütfen bekleyin, viral fikirleriniz hazırlanıyor...";

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (typeof window !== 'undefined' && window.BACKEND_API_KEY) {
            headers['Authorization'] = `Bearer ${window.BACKEND_API_KEY}`;
        }

        let response;
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = async () => {
                const image = reader.result;
                response = await fetch('/api/vision', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ message: text, image })
                });
                const data = await response.json();
                const botMessage = data.reply || data.cevap || "Sunucudan geçerli cevap alınamadı.";

                cevapAlani.innerHTML = botMessage
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            };
        } else {
            response = await fetch('/api/chat', {
                method: 'POST',
                headers,
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            const botMessage = data.reply || data.cevap || "Sunucudan geçerli cevap alınamadı.";

            cevapAlani.innerHTML = botMessage
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
            
    } catch (error) {
        console.error(error);
        cevapAlani.innerText = "⚠️ Hata: Sunucuyla iletişim kurulamadı.";
    }
}

window.soruSor = soruSor;
