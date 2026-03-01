import React, { useEffect } from 'react';

const NewsAd: React.FC = () => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error', err);
        }
    }, []);

    return (
        <div style={{ minHeight: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} aria-label="Advertisement">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-format="fluid"
                data-ad-layout-key="-gw-3+1f-3d+2z"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
            />
        </div>
    );
};

export default NewsAd;
