export const ASSET_DOCUMENTS = [
  {
    key: 'certificates',
    label: 'Certificates',
    required: true,
    maxCount: 3,
  },
  {
    key: 'legalHeirCertificate',
    label: 'Legal heir certificate',
    required: true,
    maxCount: 3,
  },
  {
    key: 'proofOfOwnership',
    label: 'Proof of ownership',
    required: true,
    maxCount: 3,
  },
  {
    key: 'labReport',
    label: 'Lab report',
    required: false,
  },
  {
    key: 'governmentCertificates',
    label: 'Any awards or government certificates',
    required: false,
  },
  {
    key: 'legalEntities',
    label: 'NOC from countries with legal entities',
    required: false,
  },
  {
    key: 'otherDocuments',
    label: 'Other Documents',
    required: false,
  },
];

const mimeTypes: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  txt: 'text/plain',
  csv: 'text/csv',
  zip: 'application/zip',
  mp4: 'video/mp4',
  json: 'application/json',
};

export const getMimeType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  return ext && mimeTypes[ext] ? mimeTypes[ext] : 'application/octet-stream';
};

export const proxyUrl = 'https://api.allorigins.win/get?url=';
