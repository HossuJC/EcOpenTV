const ec_list: any = {
    "#EXTM3U": [
        {
            "#EXTINF": -1,
            "tvg-id": "2",
            "tvg-chno": 2,
            "tvg-name": "Ecuavisa",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-002.png",
            "url": "https://redirector.rudo.video/hls-video/c54ac2799874375c81c1672abb700870537c5223/ecuavisa/ecuavisa.smil/playlist.m3u8?did=b13237840961464fec587dacfe"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "4",
            "tvg-chno": 4,
            "tvg-name": "RTS",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-004.png",
            "url": "https://d2vb5iv6i34lh5.cloudfront.net/RTSEC/93fc3c04cedad73f1f80aebf11451d53.sdp/playlist.m3u8"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "5",
            "tvg-chno": 5,
            "tvg-name": "Teleamazonas",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-005.png",
            "url": "https://teleamazonas-live.cdn.vustreams.com/live/0fc97608-6057-4db8-9af7-102c21ac18af/live.isml/0fc97608-6057-4db8-9af7-102c21ac18af.m3u8"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "7",
            "tvg-chno": 7,
            "tvg-name": "Ecuador TV",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-007.png",
            "url": "https://samson.streamerr.co:8081/akira/index.m3u8"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "8",
            "tvg-chno": 8,
            "tvg-name": "Gamavisión",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-008.png",
            "url": null,
            "default": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/canales/canal-8.m3u8"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "10",
            "tvg-chno": 10,
            "tvg-name": "TC Televisión",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-010.png",
            "url": null,
            "default": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/canales/canal-10.m3u8"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "11",
            "tvg-chno": 11,
            "tvg-name": "TVC",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-011.png",
            "url": "https://d2vb5iv6i34lh5.cloudfront.net/TVCEC/d58f5eb5cbb9ad9c56649a0083de7c8b.sdp/playlist.m3u8"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "26",
            "tvg-chno": 26,
            "tvg-name": "Oromar",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-026.png",
            "url": "https://stream.oromartv.com:8082/hls/oromartv_hi/index.m3u8|Referer=https://oromartv.com/&Origin=https://oromartv.com"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "30",
            "tvg-chno": 30,
            "tvg-name": "RTU",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-030.png",
            "url": "https://video1.makrodigital.com/rtu/rtu/playlist.m3u8"
        },
        {
            "#EXTINF": -1,
            "tvg-id": "32",
            "tvg-chno": 32,
            "tvg-name": "Telerama",
            "tvg-logo": (process.env.BASE_URL || 'localhost:8000') + "/api/v1/logos/logo-032.png",
            "url": "https://envivo.telerama.ec/stream.m3u8"
        }
    ]
}
export default ec_list;