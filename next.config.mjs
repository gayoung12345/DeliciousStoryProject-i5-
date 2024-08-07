import { withGluestackUI } from '@gluestack/ui-next-adapter';
/** @type {import('next').NextConfig} */

const nextConfig = {
    transpilePackages: ['nativewind', 'react-native-css-interop'],
    images: {
        domains: ['www.foodsafetykorea.go.kr'], // 허용할 도메인 추가
    },
};

export default withGluestackUI(nextConfig);
