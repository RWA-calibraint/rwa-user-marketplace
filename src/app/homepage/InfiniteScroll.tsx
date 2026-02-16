'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import './homepage.scss';
import useMediaQuery from '@/hooks/useMediaQuery';

const images = {
  img1: ['/images/painting1.png', '/images/painting2.png', '/images/painting3.png', '/images/painting4.png'],
  img2: ['/images/painting5.png', '/images/painting6.png', '/images/painting7.png', '/images/painting8.png'],
  img3: ['/images/painting9.png', '/images/painting10.png', '/images/painting11.png', '/images/painting12.png'],
};

const InfiniteColumn = ({
  speed = 20,
  reverse = false,
  images,
}: {
  speed: number;
  reverse?: boolean;
  images: string[];
}) => {
  const isMobileView = useMediaQuery('mobile');
  const animateParams = isMobileView
    ? { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }
    : { y: reverse ? ['-50%', '0%'] : ['0%', '-50%'] };

  return (
    <div className="column">
      <motion.div
        className="scroll-content"
        animate={animateParams}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {[...images, ...images].map((src, index) => (
          <div className="infiniteImageWrapper" key={index}>
            <Image src={src} alt={`photo-${index}`} fill style={{ objectFit: 'cover' }} sizes="250px" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const InfiniteVerticalScroll = () => {
  return (
    <div className="feat-container">
      <InfiniteColumn speed={20} images={images['img1']} />
      <InfiniteColumn speed={25} reverse images={images['img2']} />
      <InfiniteColumn speed={20} images={images['img3']} />
    </div>
  );
};

export default InfiniteVerticalScroll;
