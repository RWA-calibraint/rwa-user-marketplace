import { policyData } from '@/app/policy/interface';

export const tosData: policyData = {
  privacy: {
    label: 'Privacy Policy',
    sections: [
      {
        title: 'INTRODUCTION',
        content: `Welcome to <b>RareAgora.</b> We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our platform. By using RareAgora, you consent to the practices described in this policy.`,
      },
      {
        title: 'INFORMATION WE COLLECT',
        content: 'We may collect the following types of information:',
        listItems: [
          `<b>Personal Identification Information:</b> Name, email address, phone number, mailing address, and other contact details.`,
          `<b>inancial Information:</b> Payment details necessary to process transactions on our platform.`,
          `<b>Technical Data:</b> IP address, browser type, operating system, and other technical details when you access our platform.`,
          `<b>Usage Data:</b> Information about your interactions with our platform, such as page views and transaction history.`,
        ],
      },
      {
        title: 'HOW WE USE YOUR INFOIRMATION',
        content: 'We use the collected information for the following purposes:',
        listItems: [
          `<b>To Provide and Manage Our Services:</b> Facilitating transactions, managing accounts, and providing customer support.`,
          `<b>To Improve Our Platform:</b> Analyzing usage patterns to enhance user experience and develop new features.`,
          `<b>To Communicate with You:</b> Sending updates, promotional materials, and other information related to our services.`,
          `<b>To Ensure Security:</b> Protecting against fraudulent activities and maintaining the integrity of our platform.`,
        ],
      },
      {
        title: 'SHARING YOUR INFORMATION',
        content:
          'We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:',
        listItems: [
          `<b>Service Providers:</b> Third-party vendors who assist in operating our platform and conducting our business.`,
          `<b>Legal Obligations:</b> When required by law or to protect our rights and safety.`,
          `<b>Business Transfers</b> In connection with any merger, sale of company assets, or acquisition.`,
        ],
      },
      {
        title: 'INTERNATIONAL DATA TRANSFERS',
        content:
          'As a global platform, your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that your information remains protected.',
      },
      {
        title: 'YOUR DATA PROTECTION RIGHTS',
        content: 'Depending on your location, you may have the following rights regarding your personal data:',
        listItems: [
          `<b>Access:</b> Request copies of your personal data.`,
          `<b>Rectification:</b> Request correction of inaccurate or incomplete data.`,
          `<b>Erasure:</b> Request deletion of your personal data, subject to certain conditions.`,
          `<b>Restriction:</b> Request restriction of processing your data under certain circumstances.`,
          `<b>Objection:</b> Object to our processing of your personal data`,
          `<b>Data Portability:</b> Request transfer of your data to another organization or directly to you.`,
        ],
        contentEnd: 'To exercise these rights, please contact us at support@rareagora.com.',
      },
      {
        title: 'COOKIES ANS TRACKING TECHNOLOGIES',
        content:
          'We use cookies and similar tracking technologies to enhance your experience on our platform. You can manage your cookie preferences through your browser settings.',
      },
      {
        title: 'DATA SECURITY',
        content:
          'We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.',
      },
      {
        title: 'THIRD-PARTY LINKS',
        content:
          'Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.',
      },
      {
        title: `CHILDREN'S PRIVACY`,
        content:
          'Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.',
      },
      {
        title: 'CHANGES TO THIS PRIVACY POLICY',
        content:
          'We may update this Privacy Policy periodically. We will notify you of any significant changes by posting the new policy on our platform with an updated effective date.',
      },
      {
        title: 'CONTACT US',
        content:
          'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:',
        contentMiddle: `Email: <a href = "mailto:support@rareagora.com">support@rareagora.com</a>`,
        contentEnd:
          'By using RareAgora, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.',
      },
    ],
  },
  tos: {
    label: 'Terms of Service',
    sections: [
      {
        title: 'INTRODUCTION',
        content:
          'Welcome to RareAgora. These Terms of Service ("Terms") govern your access to and use of the RareAgora platform, including any content, functionality, and services offered on or through the platform. By accessing or using RareAgora, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the platform.',
      },
      {
        title: 'ELIGIBILITY',
        content:
          'You must be at least 18 years old and have the legal capacity to enter into binding contracts to use RareAgora. By using the platform, you represent and warrant that you meet these requirements.',
      },
      {
        title: 'ACCOUNT REGISTRATION',
        content:
          'To access certain features of RareAgora, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account.',
      },
      {
        title: 'PLATFORM OVERVIEW',
        content: 'RareAgora is a marketplace that facilitates:',
        listItems: [
          `<b>Fractional Ownership:</b> Tokenization of high-value physical assets into fractional Non-Fungible Tokens (NFTs), allowing multiple investors to own a portion of an asset.`,
          `<b>Asset Listing:</b> Asset owners can list their high-value assets for tokenization and offer fractional ownership to investors.`,
          `<b>Secondary Market:</b> A platform for buying, selling, and trading fractional NFTs representing ownership interests in tokenized assets.`,
        ],
      },
      {
        title: 'USER RESPONSIBILITIES',
        content: 'As a user of RareAgora, you agree to:',
        listItems: [
          `<b>Compliance:</b> Comply with all applicable laws, regulations, and these Terms.`,
          `<b>Prohibited Activities:</b> Refrain from engaging in any activity that is unlawful, fraudulent, or harmful to the platform or other users. `,
          `<b>Asset Verification:</b> Ensure that any assets you list for tokenization are authentic, legally owned by you, and free from any liens or encumbrances.`,
        ],
      },
      {
        title: 'TRANSACTIONS AND FEES',
        listItems: [
          `<b>Purchases:</b> When you purchase a fractional NFT, you acquire a proportional ownership interest in the underlying asset, subject to the terms outlined in the asset's offering documentation.`,
          `<b>Fees:</b> RareAgora may charge fees for transactions conducted on the platform. All applicable fees will be disclosed prior to the completion of a transaction. `,
          `<b>Payments:</b> All payments must be made in accordance with the payment methods and terms specified on the platform.`,
        ],
      },
      {
        title: 'TINTELLECTUAL PROPERTY',
        listItems: [
          `<b>Platform Content:</b> All content on RareAgora, including text, graphics, logos, and software, is the property of RareAgora or its licensors and is protected by intellectual property laws.`,
          `<b>User Content:</b> By submitting content to the platform, you grant RareAgora a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content in connection with the operation of the platform.`,
        ],
      },
      {
        title: 'DISCLAIMERS AND LIMITATION OF LIABILITY',
        listItems: [
          `<b>No Investment Advice:</b> When you purchase a fractional NFT, you acquire a proportional ownership interest in the underlying asset, subject to the terms outlined in the asset's offering documentation.`,
          `<b>Platform Availability:</b> RareAgora does not guarantee that the platform will be available at all times or that it will be free from errors or interruptions.`,
          `<b>Limitation of Liability:</b> To the fullest extent permitted by law, RareAgora shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform`,
        ],
      },
      {
        title: 'TERMINATION',
        content:
          'RareAgora reserves the right to suspend or terminate your access to the platform at its sole discretion, without notice, for conduct that it believes violates these Terms or is harmful to other users or the platform.',
      },
      {
        title: 'GOVERNING LAW',
        content:
          'These Terms shall be governed by and construed in accordance with the laws of Personal Data Protection Law (Federal Decree Law No. 45 of 2021) , without regard to its conflict of law principles.',
      },
      {
        title: 'CHANGES TO TERMS',
        content:
          'RareAgora may modify these Terms at any time by posting the revised Terms on the platform. Your continued use of the platform following any such changes constitutes your acceptance of the new Terms.',
      },
      {
        title: 'CONTACT INFORMATION',
        content:
          'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: <a href = "mailto:support@rareagora.com">support@rareagora.com</a>',
        contentEnd:
          'By using RareAgora, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.',
      },
    ],
  },
};
