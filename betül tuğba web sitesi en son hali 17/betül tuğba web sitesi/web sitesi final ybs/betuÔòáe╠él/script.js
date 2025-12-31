/* ============================================
   AINOVA - PROFESYONEL ENTEGRE AI SISTEMI
   ============================================ */

// ============================================
// 1. TEMEL DEĞİŞKENLER VE YAPILANDIRMA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("🎬 AINOVA Trend Video AI - Güncellenmiş Sistem Aktif");
    console.log("ℹ️ Model: gemini-2.5-flash-lite | API Limit: 30RPM/1500RPD");

    // ==================== GEMINI FLASH LITE AYARLARI ====================
    // ❗ KENDİ API ANAHTARINI BURAYA YAPIŞTIR
    const GEMINI_API_KEY = 'AIzaSyD6CskmUfvT18aNE3h47uoWSWENopL4BLg';
    
    // Model ID - Flash Lite Latest
    const MODEL_ID = 'gemini-2.5-flash-lite';
    
    // API URL - DÜZELTİLDİ
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`;

    // DOM Elemanları
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartModal = document.getElementById('cart-modal');
    const cartPanel = document.getElementById('cart-panel');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const loginBtn = document.getElementById('login-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const userChip = document.getElementById('user-chip');
    const mobileUserChip = document.getElementById('mobile-user-chip');
    const userNameEl = document.getElementById('user-name');
    const mobileUserNameEl = document.getElementById('mobile-user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const loginClose = document.getElementById('login-close');
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginOverlay = loginModal ? loginModal.querySelector('.auth-modal__overlay') : null;
    const registerForm = document.getElementById('register-form');
    const registerNameInput = document.getElementById('register-name');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const registerPasswordConfirmInput = document.getElementById('register-password-confirm');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const passwordToggles = document.querySelectorAll('.auth-eye');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const billingToggle = document.getElementById('billing-toggle');
    const priceDisplays = document.querySelectorAll('.price-display');
    const monthlyLabel = document.getElementById('monthly-label');
    const yearlyLabel = document.getElementById('yearly-label');

    // AI Robot Elementleri
    const robotToggle = document.getElementById('ai-robot-toggle');
    const robotWindow = document.getElementById('ai-robot-window');
    const closeRobot = document.getElementById('close-robot');
    const robotForm = document.getElementById('robot-form');
    const robotInput = document.getElementById('robot-input');
    const robotMessages = document.getElementById('robot-messages');

    // Viral Video Üretici Elementleri
    const viralBtn = document.getElementById('viral-btn');
    const viralInput = document.getElementById('viral-input');
    const viralOutput = document.getElementById('viral-output');

    // Yerel Depolama Anahtarları
    const STORAGE_KEYS = {
        CART: 'ainovaCart',
        BILLING_TYPE: 'ainovaBillingType',
        USER_PREFS: 'ainovaUserPrefs',
        AUTH: 'ainovaAuthUser',
        ORDERS: 'ainovaOrders',
        ANALYTICS: 'ainovaAnalytics',
        DATASET: 'ainovaDataset'
    };

    // Sepet ve Ayarları Yükle
    let cart = loadFromStorage(STORAGE_KEYS.CART, []);
    let isYearly = loadFromStorage(STORAGE_KEYS.BILLING_TYPE, false);
    let currentUser = loadFromStorage(STORAGE_KEYS.AUTH, null);

    // Veri Analitik Sistemi
    let analyticsData = loadFromStorage(STORAGE_KEYS.ANALYTICS, {
        pageViews: 0,
        clicks: 0,
        cartAdds: 0,
        purchases: 0,
        revenue: 0
    });

    // ============================================
    // 2. YEREL DEPOLAMA FONKSİYONLARI
    // ============================================

    function saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`❌ ${key} kaydedilemedi:`, error);
        }
    }

    function loadFromStorage(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`❌ ${key} yüklenemedi:`, error);
            return defaultValue;
        }
    }

    function clearStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`❌ ${key} temizlenemedi:`, error);
        }
    }

    // ============================================
    // 3. AUTH & LOGIN SISTEMI
    // ============================================

    function openLoginModal() {
        if (!loginModal) return;
        loginModal.classList.remove('hidden');
        setTimeout(() => loginModal.classList.add('open'), 10);
        if (loginEmailInput) loginEmailInput.focus();
    }

    function closeLoginModal() {
        if (!loginModal) return;
        loginModal.classList.remove('open');
        setTimeout(() => loginModal.classList.add('hidden'), 250);
        if (loginForm) loginForm.reset();
    }

    function updateAuthUI() {
        const loggedIn = !!currentUser;

        if (loginBtn) loginBtn.classList.toggle('hidden', loggedIn);
        if (mobileLoginBtn) mobileLoginBtn.classList.toggle('hidden', loggedIn);

        if (userChip) userChip.classList.toggle('hidden', !loggedIn);
        if (mobileUserChip) mobileUserChip.classList.toggle('hidden', !loggedIn);

        if (userNameEl) userNameEl.textContent = loggedIn ? currentUser.name : '';
        if (mobileUserNameEl) mobileUserNameEl.textContent = loggedIn ? currentUser.name : '';
    }

    function handleLogin(event) {
        event.preventDefault();
        const email = loginEmailInput?.value.trim();
        const password = loginPasswordInput?.value.trim();

        if (!email || !password) {
            showNotification('Lütfen tüm alanları doldurun.', 'warning');
            return;
        }

        const users = loadFromStorage('ainovaUsers', []);
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (!foundUser) {
            showNotification('E-posta veya şifre hatalı.', 'error');
            return;
        }

        currentUser = { name: foundUser.name, email };
        saveToStorage(STORAGE_KEYS.AUTH, currentUser);
        updateAuthUI();
        closeLoginModal();
        showNotification(`Hoş geldin, ${foundUser.name}!`, 'success');
    }

    function handleLogout() {
        currentUser = null;
        clearStorage(STORAGE_KEYS.AUTH);
        updateAuthUI();
        showNotification('Çıkış yapıldı.', 'info');
    }

    function handleRegister(event) {
        event.preventDefault();
        const name = registerNameInput?.value.trim();
        const email = registerEmailInput?.value.trim();
        const password = registerPasswordInput?.value.trim();
        const confirm = registerPasswordConfirmInput?.value.trim();

        if (!name || !email || !password || !confirm) {
            showNotification('Lütfen tüm alanları doldurun.', 'warning');
            return;
        }
        if (password !== confirm) {
            showNotification('Şifreler uyuşmuyor.', 'error');
            return;
        }

        const users = loadFromStorage('ainovaUsers', []);
        if (users.find(u => u.email === email)) {
            showNotification('Bu e-posta ile hesap zaten var.', 'warning');
            return;
        }

        users.push({ name, email, password });
        saveToStorage('ainovaUsers', users);

        currentUser = { name, email };
        saveToStorage(STORAGE_KEYS.AUTH, currentUser);
        updateAuthUI();
        closeLoginModal();
        showNotification(`Hoş geldin, ${name}!`, 'success');
    }

    function switchAuthTab(targetTab) {
        if (!tabLogin || !tabRegister || !loginForm || !registerForm) return;
        const toLogin = targetTab === 'login';
        tabLogin.classList.toggle('active', toLogin);
        tabRegister.classList.toggle('active', !toLogin);
        loginForm.classList.toggle('hidden', !toLogin);
        registerForm.classList.toggle('hidden', toLogin);
    }

    function togglePasswordVisibility(btn) {
        const targetId = btn.dataset.target;
        if (!targetId) return;
        const input = document.getElementById(targetId);
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
    }

    if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            openLoginModal();
            if (mobileMenu) mobileMenu.classList.remove('active');
        });
    }
    if (loginClose) loginClose.addEventListener('click', closeLoginModal);
    if (loginOverlay) loginOverlay.addEventListener('click', closeLoginModal);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (tabLogin) tabLogin.addEventListener('click', () => switchAuthTab('login'));
    if (tabRegister) tabRegister.addEventListener('click', () => switchAuthTab('register'));
    passwordToggles.forEach(btn => {
        btn.addEventListener('click', () => togglePasswordVisibility(btn));
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLoginModal();
    });

    // ============================================
    // 3. SAYFA YÜKLENİNCE ÇALIŞACAK FONKSİYONLAR
    // ============================================

    // Sayfa görüntüleme analitik
    trackPageView();
    updateAuthUI();
    switchAuthTab('login');
    
    // Sistemleri başlat
    updateCartUI();
    if (billingToggle) {
        billingToggle.checked = isYearly;
        updatePrices();
    }
    
    initAccordions();
    initAIAnalysis();
    initSmoothScroll();
    initCRMDashboard();
    initClickTracking();
    loadMockDataset();
    initAIRobot();
    initViralGenerator();

    // ============================================
    // 4. DÜZELTİLMİŞ GOOGLE AI API FONKSİYONU
    // ============================================

    async function generateContent(prompt, systemInstruction = '') {
        try {
            // API isteği için doğru format
            const requestBody = {
                contents: [{
                    parts: [{
                        text: systemInstruction + "\n\n" + prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            };

            console.log('🤖 API İsteği:', API_URL);
            console.log('📤 Gönderilen Veri:', requestBody);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📥 API Yanıtı:', response.status, response.statusText);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('❌ API Hata Detayı:', errorData);
                throw new Error(`API Hatası: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ API Başarılı:', data);

            // Yanıt kontrolü
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                return data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                throw new Error(`API Hatası: ${data.error.message}`);
            } else {
                console.warn('⚠️ Beklenmeyen API yanıtı:', data);
                return "Üzgünüm, şu anda cevap üretemiyorum. Lütfen daha sonra tekrar deneyin.";
            }
        } catch (error) {
            console.error('❌ AI API Hatası:', error);
            
            // Kullanıcı dostu hata mesajları
            if (error.message.includes('401')) {
                return "API anahtarı geçersiz. Lütfen admin ile iletişime geçin.";
            } else if (error.message.includes('403')) {
                return "API erişimi reddedildi. Lütfen daha sonra tekrar deneyin.";
            } else if (error.message.includes('429')) {
                return "Çok fazla istek gönderildi. Lütfen biraz bekleyip tekrar deneyin.";
            } else if (error.message.includes('fetch')) {
                return "İnternet bağlantısı sorunu. Lütfen bağlantınızı kontrol edin.";
            } else {
                return "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
            }
        }
    }

    // ============================================
    // 5. ANALİTİK VE TRACKING SISTEMI
    // ============================================

    function trackPageView() {
        analyticsData.pageViews++;
        saveToStorage(STORAGE_KEYS.ANALYTICS, analyticsData);
    }

    function trackEvent(eventType, value = 1) {
        switch(eventType) {
            case 'click':
                analyticsData.clicks += value;
                break;
            case 'cartAdd':
                analyticsData.cartAdds += value;
                break;
            case 'purchase':
                analyticsData.purchases += value;
                break;
            case 'revenue':
                analyticsData.revenue += value;
                break;
        }
        saveToStorage(STORAGE_KEYS.ANALYTICS, analyticsData);
    }

    function initClickTracking() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                trackEvent('click');
            }
        });
    }

    // ============================================
    // 6. MOBİL MENÜ
    // ============================================

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ============================================
    // 7. SEPET FONKSİYONLARI
    // ============================================

    function openCart() {
        if (!cartModal || !cartPanel) return;
        cartModal.classList.remove('hidden');
        setTimeout(() => {
            cartPanel.classList.add('open');
        }, 10);
        document.body.classList.add('cart-open');
    }

    function closeCart() {
        if (!cartPanel || !cartModal) return;
        cartPanel.classList.remove('open');
        setTimeout(() => {
            cartModal.classList.add('hidden');
        }, 300);
        document.body.classList.remove('cart-open');
    }

    if (openCartBtn) openCartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            let finalPrice = parseFloat(this.dataset.price);
            let planType = "Tek Seferlik";
            const isFixed = this.dataset.fixed === "true";

            if (!isFixed) {
                if (isYearly) {
                    finalPrice = parseFloat(this.dataset.price) * 0.8 * 12;
                    planType = "Yıllık Plan";
                } else {
                    planType = "Aylık Plan";
                }
            }

            const productId = this.dataset.id + (isFixed ? "" : (planType === "Yıllık Plan" ? "_y" : "_m"));

            const product = {
                id: productId,
                name: this.dataset.name,
                price: finalPrice,
                image: this.dataset.image || "images/ainova_logo.jpg",
                type: planType,
                quantity: 1,
                isFixed: isFixed
            };

            addToCartLogic(product);
        });
    });

    function addToCartLogic(product) {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }

        trackEvent('cartAdd');
        saveCart();
        updateCartUI();
        openCart();
        showNotification(`${product.name} sepete eklendi!`, 'success');
    }

    function saveCart() {
        saveToStorage(STORAGE_KEYS.CART, cart);
    }

    function updateCartUI() {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cartCountEl) cartCountEl.innerText = totalQty;
        if (cartTotalEl) cartTotalEl.innerText = `₺${totalPrice.toFixed(0)}`;

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="text-center text-gray-500 mt-10">
                        <div class="text-6xl mb-4">🛒</div>
                        <p>Sepetiniz boş.</p>
                    </div>
                `;
            } else {
                cart.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'cart-item';
                    div.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p style="color:#aaa; font-size:12px; margin:4px 0;">${item.type}</p>
                            <span class="item-price">₺${item.price.toFixed(0)} x ${item.quantity}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button onclick="updateQty('${item.id}', -1)" class="qty-btn">−</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button onclick="updateQty('${item.id}', 1)" class="qty-btn">+</button>
                            <button onclick="removeItem('${item.id}')" class="remove-item-btn">🗑️</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(div);
                });
            }
        }
    }

    // ============================================
    // 8. AI ROBOT SISTEMI
    // ============================================

    function initAIRobot() {
        console.log('🤖 AI Robot Sistemi Başlatılıyor...');
        
        if (robotToggle) robotToggle.addEventListener('click', toggleRobot);
        if (closeRobot) closeRobot.addEventListener('click', toggleRobot);

        if (robotForm) {
            robotForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = robotInput.value.trim();
                if (!text) return;

                console.log('📝 Kullanıcı mesajı:', text);
                addRobotMessage(text, 'user');
                robotInput.value = '';
                
                const loader = document.createElement('div');
                loader.className = 'bot-bubble typing-dots';
                loader.innerHTML = '<span></span><span></span><span></span>';
                robotMessages.appendChild(loader);
                robotMessages.scrollTop = robotMessages.scrollHeight;

                try {
                    const systemInstruction = `Sen AINOVA'nın Trend AI asistanısın. 
Kullanıcılara TikTok, Instagram Reels ve YouTube Shorts için viral video fikirleri üretirsin.
Güncel trendleri takip eder, yaratıcı içerik stratejileri önerirsin.
Kısa, samimi ve yaratıcı cevaplar verirsin. Türkçe konuşursun.
Her zaman pratik ve uygulanabilir önerilerde bulunursun.`;
                    
                    console.log('🤖 AI çağrısı yapılıyor...');
                    const result = await generateContent(text, systemInstruction);
                    console.log('✅ AI Yanıtı:', result);
                    
                    loader.remove();
                    
                    const formattedReply = result
                        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                        .replace(/\n/g, '<br>');
                    
                    addRobotMessage(formattedReply, 'bot');
                    
                } catch (error) {
                    console.error('❌ Robot Hatası:', error);
                    loader.remove();
                    addRobotMessage(`Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.`, 'bot');
                }
            });
        }

        // Enter tuşu desteği
        if (robotInput) {
            robotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    robotForm.dispatchEvent(new Event('submit'));
                }
            });
        }
    }

    function toggleRobot() {
        if (robotWindow.classList.contains('hidden')) {
            robotWindow.classList.remove('hidden');
            setTimeout(() => { 
                robotWindow.classList.add('open'); 
                if (robotInput) robotInput.focus(); 
            }, 10);
        } else {
            robotWindow.classList.remove('open');
            setTimeout(() => robotWindow.classList.add('hidden'), 300);
        }
    }

    function addRobotMessage(text, sender) {
        const div = document.createElement('div');
        div.className = sender === 'user' ? 'flex justify-end' : 'flex justify-start';
        div.innerHTML = `<div class="${sender === 'user' ? 'user-bubble' : 'bot-bubble'}">${text}</div>`;
        robotMessages.appendChild(div);
        robotMessages.scrollTop = robotMessages.scrollHeight;
    }

    // ============================================
    // 9. VIRAL VIDEO ÜRETICI
    // ============================================

    function initViralGenerator() {
        if (viralBtn) {
            viralBtn.addEventListener('click', async () => {
                const topic = viralInput.value.trim();
                if (!topic) {
                    alert("Lütfen bir konu giriniz!");
                    return;
                }
                
                viralOutput.innerHTML = '<div class="text-center"><span class="text-pink-500 animate-pulse text-xl">Fikirler üretiliyor...</span></div>';
                viralBtn.disabled = true;
                
                try {
                    const prompt = `"${topic}" konusuyla ilgili 2025 yılında viral olabilecek TikTok, Instagram Reels ve YouTube Shorts için 5 yaratıcı video fikri üret.

Her fikir için şunları ekle:
- Platform (TikTok/Reels/Shorts)
- Video Konsepti (detaylı açıklama)
- Viral Potansiyeli (%)
- İpucu (1-2 cümle)
- Hedef Kitle

Her fikri numaralandır ve profesyonel bir şekilde sun. Türkçe olsun.`;

                    const systemInstruction = `Sen trend video içerikleri konusunda uzman bir yapay zeka asistanısın. 
Güncel TikTok, Instagram Reels ve YouTube Shorts trendlerini takip edersin.
Viral olabilecek, dikkat çekici ve özgün video fikirleri üretirsin.
Kullanıcıya pratik, uygulanabilir ve yaratıcı öneriler sunarsın.
Her zaman güncel ve tutarlı cevaplar verirsin. Türkçe konuşursun.
Her zaman pratik ve uygulanabilir önerilerde bulunursun.`;
                    
                    const result = await generateContent(prompt, systemInstruction);
                    
                    const formattedText = result
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>')
                        .replace(/\n\n/g, '<br><br>')
                        .replace(/\n/g, '<br>');
                    
                    viralOutput.innerHTML = `<div class="text-white leading-relaxed text-base p-4">${formattedText}</div>`;
                } catch(error) {
                    console.error('❌ Viral Generator Hatası:', error);
                    viralOutput.innerHTML = `<div class="text-center"><span class="text-red-400">Hata: ${error.message}</span></div>`;
                } finally {
                    viralBtn.disabled = false;
                }
            });
            
            // Enter tuşu ile çalıştırma
            viralInput.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') {
                    viralBtn.click();
                }
            });
        }
    }

    // ============================================
    // 10. CRM DASHBOARD ve VERİ VİZUALİZASYONU
    // ============================================

    function initCRMDashboard() {
        // Gerçek zamanlı verileri göster
        updateCRMMetrics();
        
        // Her 5 saniyede bir güncelle
        setInterval(updateCRMMetrics, 5000);
    }

    function updateCRMMetrics() {
        const orders = loadFromStorage(STORAGE_KEYS.ORDERS, []);
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        
        // CRM metriklerini güncelle
        const metrics = {
            totalRevenue: totalRevenue,
            totalOrders: totalOrders,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            activeUsers: analyticsData.pageViews,
            conversionRate: analyticsData.pageViews > 0 ? (analyticsData.purchases / analyticsData.pageViews * 100) : 0
        };
        
        console.log('📊 CRM Metrikleri:', metrics);
    }

    // ============================================
    // 11. MOCK DATASET YÜKLEME (10.000+ Kayıt)
    // ============================================

    function loadMockDataset() {
        let dataset = loadFromStorage(STORAGE_KEYS.DATASET, null);
        
        if (!dataset || dataset.length < 10000) {
            dataset = generateMockDataset(10000);
            saveToStorage(STORAGE_KEYS.DATASET, dataset);
            console.log(`✅ ${dataset.length} adet mock veri oluşturuldu ve kaydedildi.`);
        } else {
            console.log(`✅ ${dataset.length} adet mock veri yüklendi.`);
        }
    }

    function generateMockDataset(count) {
        const dataset = [];
        const segments = ['Influencer', 'SMB', 'Corporate', 'Student'];
        const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter'];
        
        for (let i = 0; i < count; i++) {
            dataset.push({
                id: i + 1,
                customer_segment: segments[Math.floor(Math.random() * segments.length)],
                platform: platforms[Math.floor(Math.random() * platforms.length)],
                engagement_rate: Math.random() * 100,
                followers: Math.floor(Math.random() * 100000),
                monthly_spend: Math.floor(Math.random() * 1000),
                churn_risk: Math.random(),
                satisfaction_score: Math.floor(Math.random() * 100)
            });
        }
        
        return dataset;
    }

    // ============================================
    // 12. PDF RAPOR OLUŞTURMA
    // ============================================

    function generateInvoicePDF(items, total) {
        showNotification('📄 Fatura PDF olarak hazırlanıyor...', 'info');
        
        // jsPDF kütüphanesi ile gerçek PDF oluşturulabilir
        // Burada simüle ediyoruz
        setTimeout(() => {
            showNotification('✅ Fatura e-postanıza gönderildi!', 'success');
        }, 2000);
    }

    // ============================================
    // 13. AKORDİYON VE SMOOTH SCROLL
    // ============================================

    function initAccordions() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('.accordion-icon');
                
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== this) {
                        const otherContent = otherHeader.nextElementSibling;
                        const otherIcon = otherHeader.querySelector('.accordion-icon');
                        otherContent.classList.remove('active');
                        if (otherIcon) otherIcon.textContent = '+';
                    }
                });
                
                content.classList.toggle('active');
                if (icon) {
                    icon.textContent = content.classList.contains('active') ? '−' : '+';
                }
            });
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || href === '') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                    }
                }
            });
        });
    }

    // ============================================
    // 14. AI ANALIZ SISTEMI
    // ============================================

    function initAIAnalysis() {
        // AI analiz butonları ve formları için event listeners
        const analyzeBtn = document.getElementById('analyze-btn');
        const brandInput = document.getElementById('brand-input');
        const analysisOutput = document.getElementById('analysis-output');

        if (analyzeBtn && brandInput && analysisOutput) {
            analyzeBtn.addEventListener('click', async () => {
                const brandData = brandInput.value.trim();
                if (!brandData) return;

                analysisOutput.innerHTML = '<div class="text-center"><span class="text-blue-500 animate-pulse">Analiz yapılıyor...</span></div>';
                analyzeBtn.disabled = true;

                try {
                    const prompt = `Aşağıdaki marka bilgilerini analiz et ve sosyal medya stratejisi öner:
                    ${brandData}
                    
                    Lütfen şunları içer:
                    1. Marka kimliği analizi
                    2. Hedef kitle önerileri
                    3. İçerik stratejisi
                    4. Platform önerileri
                    5. Hashtag önerileri`;

                    const result = await generateContent(prompt);
                    analysisOutput.innerHTML = `<div class="text-white p-4">${result.replace(/\n/g, '<br>')}</div>`;
                } catch (error) {
                    analysisOutput.innerHTML = `<div class="text-red-500">Analiz yapılırken hata oluştu.</div>`;
                } finally {
                    analyzeBtn.disabled = false;
                }
            });
        }
    }

    // ============================================
    // 15. BİLDİRİM SISTEMI
    // ============================================

    function showNotification(message, type = 'info') {
        const existingNotif = document.querySelector('.ainova-notification');
        if (existingNotif) existingNotif.remove();

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const notif = document.createElement('div');
        notif.className = `ainova-notification fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-xl z-[70] transform transition-all duration-300`;
        notif.style.minWidth = '250px';
        notif.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-xl font-bold">&times;</button>
            </div>
        `;

        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.transform = 'translateX(400px)';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }

    // ============================================
    // 16. FİYATLANDIRMA SİSTEMİ
    // ============================================

    function updatePrices() {
        if (isYearly) {
            if (monthlyLabel) monthlyLabel.classList.replace('text-white', 'text-gray-500');
            if (yearlyLabel) yearlyLabel.classList.replace('text-gray-500', 'text-white');
            if (billingToggle) {
                const dot = billingToggle.nextElementSibling.querySelector('.dot');
                if (dot) dot.style.transform = 'translateX(125%)';
            }
        } else {
            if (monthlyLabel) monthlyLabel.classList.replace('text-gray-500', 'text-white');
            if (yearlyLabel) yearlyLabel.classList.replace('text-white', 'text-gray-500');
            if (billingToggle) {
                const dot = billingToggle.nextElementSibling.querySelector('.dot');
                if (dot) dot.style.transform = 'translateX(0)';
            }
        }

        priceDisplays.forEach((display) => {
            const basePrice = parseFloat(display.dataset.basePrice);
            if (display.dataset.fixed === "true") return;

            if (isYearly) {
                const monthlyDiscounted = (basePrice * 0.8).toFixed(0);
                display.innerHTML = `₺${monthlyDiscounted} <span class="text-lg sm:text-xl font-medium text-gray-500">/ay</span>`;
            } else {
                display.innerHTML = `₺${basePrice} <span class="text-lg sm:text-xl font-medium text-gray-500">/ay</span>`;
            }
        });

        saveToStorage(STORAGE_KEYS.BILLING_TYPE, isYearly);
    }

    if (billingToggle) {
        billingToggle.addEventListener('change', (e) => {
            isYearly = e.target.checked;
            updatePrices();
            showNotification(isYearly ? 'Yıllık plan seçildi (%20 indirim!)' : 'Aylık plan seçildi', 'info');
        });
    }

    // ============================================
    // 17. ÖDEME İŞLEMİ
    // ============================================

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
                
                const orderSummary = cart.map(item => 
                    `• ${item.name} (${item.type}) x${item.quantity} = ₺${(item.price * item.quantity).toFixed(0)}`
                ).join('\n');
                
                if (confirm(`🛒 SİPARİŞ ÖZETİ\n\n${orderSummary}\n\n💰 TOPLAM: ₺${total.toFixed(0)}\n📦 ${itemCount} ürün\n\nÖdemeyi onaylıyor musunuz?`)) {
                    saveOrder(cart, total);
                    trackEvent('purchase');
                    trackEvent('revenue', total);
                    
                    cart = [];
                    saveCart();
                    updateCartUI();
                    closeCart();
                    
                    showNotification('🎉 Ödeme başarılı! Teşekkür ederiz.', 'success');
                    generateInvoicePDF(cart, total);
                }
            } else {
                showNotification('⚠️ Sepetiniz boş!', 'warning');
            }
        });
    }

    function saveOrder(items, total) {
        const orders = loadFromStorage(STORAGE_KEYS.ORDERS, []);
        const order = {
            id: Date.now(),
            date: new Date().toLocaleString('tr-TR'),
            items: items,
            total: total
        };
        orders.push(order);
        saveToStorage(STORAGE_KEYS.ORDERS, orders);
    }

}); // DOMContentLoaded SONU

// ============================================
// 18. GLOBAL FONKSİYONLAR
// ============================================

// Sepet için global fonksiyonlar
window.updateQty = function(id, change) {
    const cart = JSON.parse(localStorage.getItem('ainovaCart') || '[]');
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            window.removeItem(id);
        } else {
            localStorage.setItem('ainovaCart', JSON.stringify(cart));
            window.location.reload();
        }
    }
};

window.removeItem = function(id) {
    let cart = JSON.parse(localStorage.getItem('ainovaCart') || '[]');
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('ainovaCart', JSON.stringify(cart));
    window.location.reload();
};
