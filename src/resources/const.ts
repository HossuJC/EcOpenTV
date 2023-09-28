export const channel_template: string = "#EXTM3U\n#EXT-X-STREAM-INF:RESOLUTION=1280x720,FRAME-RATE=30.000000,BANDWIDTH=2179072,CODECS=\"avc1.64001f,mp4a.40.2\",NAME=\"720\"\nreplace_link_here";

export const ec: any = {
    "#EXTM3U": [
        {
            "#EXTINF": -1,
            "tvg-id": "002",
            "tvg-chno": 2,
            "tvg-name": "Ecuavisa",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-002.png",
            "url": "https://redirector.rudo.video/hls-video/c54ac2799874375c81c1672abb700870537c5223/ecuavisa/ecuavisa.smil/playlist.m3u8?did=b13237840961464fec587dacfe",
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-002.m3u8",
            "strategy": "direct",
            "options": {
                "webpages": [],
                "target": "",
                "blockedTypes": [],
                "blockedUrls": [],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "004",
            "tvg-chno": 4,
            "tvg-name": "RTS",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-004.png",
            "url": "https://d2vb5iv6i34lh5.cloudfront.net/RTSEC/93fc3c04cedad73f1f80aebf11451d53.sdp/playlist.m3u8|Referer=https://www.rts.com.ec/&Origin=https://www.rts.com.ec",
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-004.m3u8",
            "strategy": "direct",
            "options": {
                "webpages": [],
                "target": "",
                "blockedTypes": [],
                "blockedUrls": [],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "005",
            "tvg-chno": 5,
            "tvg-name": "Teleamazonas",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-005.png",
            "url": "https://teleamazonas-live.cdn.vustreams.com/live/0fc97608-6057-4db8-9af7-102c21ac18af/live.isml/0fc97608-6057-4db8-9af7-102c21ac18af.m3u8",
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-005.m3u8",
            "strategy": "direct",
            "options": {
                "webpages": [],
                "target": "",
                "blockedTypes": [],
                "blockedUrls": [],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "007",
            "tvg-chno": 7,
            "tvg-name": "Ecuador TV",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-007.png",
            "url": "https://samson.streamerr.co:8081/akira/index.m3u8",
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-007.m3u8",
            "strategy": "direct",
            "options": {
                "webpages": [],
                "target": "",
                "blockedTypes": [],
                "blockedUrls": [],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "008",
            "tvg-chno": 8,
            "tvg-name": "Gamavisión",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-008.png",
            "url": null,
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-008.m3u8",
            "strategy": "shallow",
            "options": {
                "webpages": ["https://www.gamavision.com.ec/", "https://vimeo.com/event/3564149/embed"],
                "target": "https://live-ak.vimeocdn.com/",
                "blockedTypes": [
                    // "xhr",
                    // "script",
                    // "document",
                    // "prefetch",
                    // "stylesheet",
                    "image",
                    "media",
                    "font",
                    "texttrack",
                    "fetch",
                    "eventsource",
                    "websocket",
                    "manifest",
                    "signedexchange",
                    "ping",
                    "cspviolationreport",
                    "preflight",
                    "other",
                ],
                "blockedUrls": [
                    "https://www.gamavision.com.ec/wp-",
                    "https://www.google-analytics.com/",
                    "https://connect.facebook.net/",
                    "https://static.addtoany.com/",
                    "https://bam.nr-data.net/",
                    "https://www.gstatic.com/",
                    "https://www.googletagmanager.com/",
                    "https://fonts.googleapis.com/",
                    "https://tracker.metricool.com/",
                    "https://js-agent.newrelic.com/",
                    "https://cdn.jsdelivr.net/",
                    "https://player.vimeo.com/static/proxy.html",
                    "https://f.vimeocdn.com/js_opt/app/embed/_next/static/s",
                    "https://f.vimeocdn.com/js_opt/app/embed/_next/static/css/",
                ],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "010",
            "tvg-chno": 10,
            "tvg-name": "TC Televisión",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-010.png",
            "url": null,
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-010.m3u8",
            "strategy": "deep",
            "options": {
                "webpages": ["https://www.tctelevision.com/tc-en-vivo"],
                "target": "https://www.dailymotion.com/cdn/live/video/x7wijay.m3u8",
                "blockedTypes": [
                    // "xhr",
                    // "script",
                    // "document",
                    "image",
                    "media",
                    "font",
                    "texttrack",
                    "fetch",
                    "prefetch",
                    "eventsource",
                    "websocket",
                    "manifest",
                    "signedexchange",
                    "ping",
                    "cspviolationreport",
                    "preflight",
                    "other",
                    "stylesheet",
                ],
                "blockedUrls": [
                    "https://code.jquery.com/",
                    "https://securepubads.g.doubleclick.net/",
                    "https://www.gstatic.com/",
                    "https://cdnjs.cloudflare.com/",
                    "https://www.googletagmanager.com/",
                    "https://www.tctelevision.com/core/",
                    "https://programacion.tctelevision.com/",
                    "https://imasdk.googleapis.com/",
                    "https://pebed.dm-event.net/",
                    "https://vendorlist.dmcdn.net/",
                    "https://speedtest.dailymotion.com/latencies.js",
                    "https://dmxleo.dailymotion.com/",
                    "https://static1.dmcdn.net/playerv5/dmp.controls_vod_secondary",
                    "https://static1.dmcdn.net/playerv5/dmp.omid_session_client",
                    "https://static1.dmcdn.net/playerv5/dmp.omweb",
                    "https://static1.dmcdn.net/playerv5/dmp.locale",
                    "https://static1.dmcdn.net/playerv5/dmp.advertising",
                    "https://static1.dmcdn.net/playerv5/dmp.photon_player",
                ],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "011",
            "tvg-chno": 11,
            "tvg-name": "TVC",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-011.png",
            "url": "https://d2vb5iv6i34lh5.cloudfront.net/TVCEC/d58f5eb5cbb9ad9c56649a0083de7c8b.sdp/playlist.m3u8|Referer=https://www.tvc.com.ec/&Origin=https://www.tvc.com.ec",
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-011.m3u8",
            "strategy": "direct",
            "options": {
                "webpages": [],
                "target": "",
                "blockedTypes": [],
                "blockedUrls": [],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "026",
            "tvg-chno": 26,
            "tvg-name": "Oromar",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-026.png",
            "url": "https://stream.oromartv.com:8082/hls/oromartv_hi/index.m3u8|Referer=https://oromartv.com/&Origin=https://oromartv.com",
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-026.m3u8",
            "strategy": "direct",
            "options": {
                "webpages": [],
                "target": "",
                "blockedTypes": [],
                "blockedUrls": [],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "030",
            "tvg-chno": 30,
            "tvg-name": "RTU",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-030.png",
            "url": "https://video1.makrodigital.com/rtu/rtu/playlist.m3u8",
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-030.m3u8",
            "strategy": "direct",
            "options": {
                "webpages": [],
                "target": "",
                "blockedTypes": [],
                "blockedUrls": [],
            }
        },
        {
            "#EXTINF": -1,
            "tvg-id": "032",
            "tvg-chno": 32,
            "tvg-name": "Telerama",
            "tvg-logo": (process.env.BASE_URL || "localhost:8000") + "/api/v1/logos/logo-032.png",
            "url": "https://envivo.telerama.ec/stream.m3u8",
            "list-url": (process.env.BASE_URL || "localhost:8000") + "/api/v1/canales/canal-032.m3u8",
            "strategy": "direct",
            "options": {
                "webpages": [],
                "target": "",
                "blockedTypes": [],
                "blockedUrls": [],
            }
        }
    ]
}
