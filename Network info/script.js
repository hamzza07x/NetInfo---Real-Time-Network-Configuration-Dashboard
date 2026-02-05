function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    document.getElementById('themeIcon').textContent = newTheme === 'dark' ? '🌙' : '☀️';
    document.getElementById('themeText').textContent = newTheme === 'dark' ? 'Dark' : 'Light';
    
    localStorage.setItem('theme', newTheme);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
document.getElementById('themeIcon').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
document.getElementById('themeText').textContent = savedTheme === 'dark' ? 'Dark' : 'Light';

async function getLocalIPs() {
    return new Promise((resolve) => {
        const ips = new Set();
        const timeout = setTimeout(() => {
            resolve(Array.from(ips));
        }, 2000);

        try {
            const pc = new RTCPeerConnection({
                iceServers: []
            });

            pc.createDataChannel('');

            pc.onicecandidate = (event) => {
                if (!event || !event.candidate) {
                    clearTimeout(timeout);
                    resolve(Array.from(ips));
                    return;
                }

                const candidate = event.candidate.candidate;
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                const match = ipRegex.exec(candidate);

                if (match) {
                    const ip = match[1];
                    // Filter out common non-local IPs
                    if (!ip.startsWith('0.') && 
                        !ip.startsWith('127.') && 
                        ip !== '0.0.0.0') {
                        ips.add(ip);
                    }
                }
            };

            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .catch(() => {
                    clearTimeout(timeout);
                    resolve([]);
                });

        } catch (error) {
            clearTimeout(timeout);
            resolve([]);
        }
    });
}

async function loadLocalNetworkInfo() {
    const localIPs = await getLocalIPs();
    
    let localNetworkHTML = '';

    if (localIPs.length > 0) {
        localIPs.forEach((ip, index) => {
            const isPrivate = ip.startsWith('192.168.') || 
                            ip.startsWith('10.') || 
                            ip.startsWith('172.');
            
            localNetworkHTML += `
                <div class="info-item">
                    <span class="info-label">${isPrivate ? 'Private' : 'Local'} IP ${index + 1}</span>
                    <span class="info-value">${ip}</span>
                </div>
            `;
        });

        const firstIP = localIPs[0];
        let networkClass = 'Unknown';
        let subnetGuess = 'N/A';
        
        if (firstIP.startsWith('192.168.')) {
            networkClass = 'Class C Private';
            subnetGuess = '255.255.255.0 (likely)';
        } else if (firstIP.startsWith('10.')) {
            networkClass = 'Class A Private';
            subnetGuess = '255.0.0.0 or 255.255.0.0 (likely)';
        } else if (firstIP.startsWith('172.')) {
            networkClass = 'Class B Private';
            subnetGuess = '255.255.0.0 (likely)';
        }

        localNetworkHTML += `
            <div class="info-item">
                <span class="info-label">Network Class</span>
                <span class="info-value">${networkClass}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Subnet Mask (Estimated)</span>
                <span class="info-value">${subnetGuess}</span>
            </div>
        `;
    } else {
        localNetworkHTML = `
            <div class="info-item">
                <span class="info-label">Status</span>
                <span class="info-value">⚠️ Unable to detect local IP</span>
            </div>
            <div class="info-item">
                <span class="info-label">Note</span>
                <span class="info-value">Browser privacy settings may block this</span>
            </div>
            <div class="info-item">
                <span class="info-label">Alternative</span>
                <span class="info-value">Run "ipconfig" (Windows) or "ifconfig" (Mac/Linux) in terminal</span>
            </div>
        `;
    }

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        localNetworkHTML += `
            <div class="info-item">
                <span class="info-label">Connection Type</span>
                <span class="info-value">${connection.effectiveType || connection.type || 'Unknown'}</span>
            </div>
        `;
        if (connection.downlink) {
            localNetworkHTML += `
                <div class="info-item">
                    <span class="info-label">Downlink Speed</span>
                    <span class="info-value">${connection.downlink} Mbps</span>
                </div>
            `;
        }
        if (connection.rtt) {
            localNetworkHTML += `
                <div class="info-item">
                    <span class="info-label">Round Trip Time</span>
                    <span class="info-value">${connection.rtt} ms</span>
                </div>
            `;
        }
    }

    document.getElementById('localNetworkInfo').innerHTML = localNetworkHTML;
}

function detectDevice() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return '📱 Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return '📱 Mobile';
    }
    return '💻 Desktop';
}

async function loadIPData() {
    const apis = [
        {
            url: 'https://api.ipify.org?format=json',
            detailUrl: 'http://ip-api.com/json/',
            parseBasic: (data) => data.query || data.ip,
            parseDetail: (data) => ({
                ip: data.query,
                country: data.country,
                countryCode: data.countryCode,
                region: data.regionName,
                city: data.city,
                zip: data.zip,
                lat: data.lat,
                lon: data.lon,
                timezone: data.timezone,
                isp: data.isp,
                org: data.org,
                as: data.as
            })
        },
        {
            url: 'https://api.ipify.org?format=json',
            parseBasic: (data) => data.ip
        }
    ];

    try {
        let ipAddress = null;
        for (const api of apis) {
            try {
                const response = await fetch(api.url);
                const data = await response.json();
                ipAddress = api.parseBasic(data);
                if (ipAddress) break;
            } catch (e) {
                continue;
            }
        }

        if (!ipAddress) {
            throw new Error('Could not fetch IP address');
        }

        document.getElementById('publicIP').textContent = ipAddress;
        document.getElementById('deviceType').textContent = detectDevice();

        try {
            const detailResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
            const detail = await detailResponse.json();
            
            if (detail.status === 'success') {
                const locationHTML = `
                    <div class="info-item">
                        <span class="info-label">Country</span>
                        <span class="info-value">${detail.country} (${detail.countryCode})</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">City</span>
                        <span class="info-value">${detail.city || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Region</span>
                        <span class="info-value">${detail.regionName || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Postal Code</span>
                        <span class="info-value">${detail.zip || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Timezone</span>
                        <span class="info-value">${detail.timezone || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Coordinates</span>
                        <span class="info-value">${detail.lat}, ${detail.lon}</span>
                    </div>
                `;
                document.getElementById('locationInfo').innerHTML = locationHTML;
                
                const networkHTML = `
                    <div class="info-item">
                        <span class="info-label">ISP</span>
                        <span class="info-value">${detail.isp || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Organization</span>
                        <span class="info-value">${detail.org || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">AS Number</span>
                        <span class="info-value">${detail.as || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Connection Type</span>
                        <span class="info-value">${detail.mobile ? 'Mobile' : 'Broadband'}</span>
                    </div>
                `;
                document.getElementById('networkInfo').innerHTML = networkHTML;
            } else {
                showFallbackData();
            }
        } catch (detailError) {
            console.log('Detailed info unavailable, showing basic data');
            showFallbackData();
        }
        
    } catch (error) {
        document.getElementById('publicIP').textContent = 'Unable to fetch IP';
        console.error('Error fetching IP data:', error);
        showFallbackData();
    }
}

function showFallbackData() {
    document.getElementById('locationInfo').innerHTML = `
        <div class="info-item">
            <span class="info-label">Status</span>
            <span class="info-value">⚠️ Location data unavailable</span>
        </div>
        <div class="info-item">
            <span class="info-label">Note</span>
            <span class="info-value">Deploy to a web server for full features</span>
        </div>
    `;
    
    document.getElementById('networkInfo').innerHTML = `
        <div class="info-item">
            <span class="info-label">Status</span>
            <span class="info-value">⚠️ Network details unavailable</span>
        </div>
        <div class="info-item">
            <span class="info-label">Note</span>
            <span class="info-value">Some APIs blocked in local environment</span>
        </div>
    `;
}

function loadDeviceInfo() {
    const nav = navigator;
    
    const deviceHTML = `
        <div class="info-item">
            <span class="info-label">Browser</span>
            <span class="info-value">${getBrowserName()}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Platform</span>
            <span class="info-value">${nav.platform || 'N/A'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Language</span>
            <span class="info-value">${nav.language || 'N/A'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Screen Resolution</span>
            <span class="info-value">${screen.width} × ${screen.height}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Viewport</span>
            <span class="info-value">${window.innerWidth} × ${window.innerHeight}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Color Depth</span>
            <span class="info-value">${screen.colorDepth}-bit</span>
        </div>
        <div class="info-item">
            <span class="info-label">Online Status</span>
            <span class="info-value">${nav.onLine ? '🟢 Online' : '🔴 Offline'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Cookies Enabled</span>
            <span class="info-value">${nav.cookieEnabled ? '✅ Yes' : '❌ No'}</span>
        </div>
    `;
    document.getElementById('deviceInfo').innerHTML = deviceHTML;
}

function getBrowserName() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
    if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    return 'Unknown';
}

function loadAllData() {
    loadIPData();
    loadLocalNetworkInfo();
    loadDeviceInfo();
}

function refreshWithAnimation() {
    const btn = document.querySelector('.refresh-btn');
    const cards = document.querySelectorAll('.glass-card');
    
    btn.classList.add('refreshing');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('card-refresh');
            
            setTimeout(() => {
                card.classList.remove('card-refresh');
            }, 800);
        }, index * 120);
    });
    
    setTimeout(() => {
        loadAllData();
    }, 400);
    
    setTimeout(() => {
        btn.classList.remove('refreshing');
    }, cards.length * 120 + 800);
}

loadAllData();

window.addEventListener('resize', () => {
    const viewportElement = document.querySelector('.info-item:nth-child(5) .info-value');
    if (viewportElement) {
        viewportElement.textContent = `${window.innerWidth} × ${window.innerHeight}`;
    }
});