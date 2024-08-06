import Image from 'next/image';

const Footer = () => {
    return (
        <div className="flex items-center justify-center">
            {/* 일단이미지로추가 */}
            <Image
                src="/svg/footer.svg"
                width={1000}
                height={760}
                className="hidden md:block"
                alt="Screenshots of the dashboard project showing desktop version"
            />
        </div>
    );
};

export default Footer;
