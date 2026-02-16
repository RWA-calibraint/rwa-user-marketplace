export enum DOCUMENT_TYPE {
  LAB_REPORTS = 'labReport',
  CERTIFICATES = 'certificates',
  LEGAL_HEIR_CERTIFICATES = 'legalHeirCertificate',
  PROOF_OF_OWNERSHIP = 'proofOfOwnership',
  AWARDS = 'governmentCertificates',
  NOC = 'legalEntities',
  OTHERS = 'otherDocuments',
}

export enum DOCUMENT_MODAL_TYPE {
  REMOVE = 'remove_approval',
  REJECT = 'reject_document',
  APPROVE = 'approve_document',
}

export enum DOC_TYPE {
  IMAGE = 'image',
  DOCUMENT = 'pdf',
}
