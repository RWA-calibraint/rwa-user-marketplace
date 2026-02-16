import Image from 'next/image';
import Link from 'next/link';
import './footer.scss';

import { footerContent } from '@app/submission/constants';

const Footer = () => {
  return (
    <footer
      id="footer"
      className="width-100 bg-brand-darker position-relative bottom-0 d-flex flex-column gap-2 footer-container"
      style={{ marginTop: 'auto' }}
    >
      <div className="d-flex justify-space-between p-x-80 p-y-60 footer-content-container">
        <div className="d-flex flex-column align-justify max-w-300 gap-4 fc-1">
          <Link className="d-flex flex-1 bg-none cursor-pointer border-none icon-2-primary" href="/">
            <Image src="/images/rareagora-logo-light.png" alt="Logo" width={200} height={35} />
          </Link>

          <p className="f-16-22-400-text-white opacity-80 text-justify">{footerContent.tagline}</p>
          <div className="d-flex gap-3">
            {footerContent.socialMedia.map((social, index) => (
              <a
                key={index}
                className="d-flex align-center justify-center w-40 h-40 bg-brand-dark radius-100 icon-40-white p-10"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={social.icon === 'twitter' ? '/icons/social_x.svg' : '/icons/social_linkedin.svg'}
                  alt="Socials"
                  width={social.icon === 'twitter' ? 18 : 16}
                  height={social.icon === 'twitter' ? 18 : 16}
                />
              </a>
            ))}
          </div>
        </div>
        <div className="d-flex gap-25 fc-2">
          <div className="d-flex flex-column gap-4">
            <h4 className="f-16-22-600-white-primary">Resources</h4>
            <ul className="p-0  m-0 list-style-none d-flex flex-column gap-3">
              {footerContent?.resources?.map((link, index) => (
                <li key={index}>
                  <a className="f-16-22-400-text-white opacity-80 text-none" href={link.url}>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mobile-footer-divider"></div>
          <div className="d-flex flex-column gap-4">
            <h4 className="f-16-22-600-white-primary">Legal</h4>
            <ul className="p-0  m-0 list-style-none d-flex flex-column gap-3">
              {footerContent?.legal?.map((link, index) => (
                <li key={index}>
                  <a className="f-16-22-400-text-white opacity-80 text-none" href={link.url}>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mobile-footer-divider"></div>
          <div className="d-flex flex-column gap-4">
            <h4 className="f-16-22-600-white-primary">Company</h4>
            <ul className="p-0  m-0 list-style-none d-flex flex-column gap-3">
              {footerContent?.Company?.map((link, index) => (
                <li key={index}>
                  <a className="f-16-22-400-text-white opacity-80 text-none" href={link.url}>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="d-flex h-70 justify-space-between p-x-80 p-y-24 text-center border-top-brand-dark-1 p-t-16  footer-bottom-container">
        <p className="m-0 f-16-22-400-text-white opacity-80">{footerContent.copyright}</p>
        <ul className="d-flex list-style-none p-0 m-t-0">
          {footerContent?.links?.map((link, index) => (
            <li key={index} className="d-inline m-0">
              <>
                <a className="text-none f-16-22-400-text-white opacity-80" href={link.url}>
                  {link.text}
                </a>
                {index !== footerContent.links.length - 1 && <span className="m-x-10 f-16-22-400-tertiary">|</span>}
              </>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
