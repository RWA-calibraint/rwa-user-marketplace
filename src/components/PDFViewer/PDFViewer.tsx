'use client';

import { Button } from 'antd';
import { Download, Minus, Plus, X } from 'lucide-react';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useToast } from '@/helpers/notifications/toast.notification';

import { Document as IDocument } from '../asset-details/interface';

export default function PDFViewer({ pdfDocument, onClose }: { pdfDocument: IDocument; onClose: () => void }) {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState(1.2);
  const [file, _setFile] = useState<IDocument>(pdfDocument);

  const { showErrorToast } = useToast();

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  const handleDownload = () => {
    fetch(file.documentUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = file.documentName || `${pdfDocument.type}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        showErrorToast(error, 'Error downloading document.');
      });
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div className="width-100 height-100 position-fixed inset-0 top-0 left-0 bg-black-shade z-index-10">
      <div className="h-72 d-flex align-center p-x-20 p-y-28">
        <div className="d-flex justify-flex-start flex-1 align-center">
          <Button type="text" onClick={onClose} className="actions">
            <X className="icon-24-white cursor-pointer" />
          </Button>
          <p className="f-16-19-600-white-primary m-l-8">{file.documentName}</p>
        </div>
        <div className="d-flex justify-flex-end flex-1 gap-5">
          <Button type="text" onClick={handleDownload} className="actions">
            <Download className="icon-24-white cursor-pointer" />
          </Button>
        </div>
      </div>

      <div className="d-flex justify-center h-calc-180 overflow-scroll m-20 gap-2">
        <Document file={file.documentUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (_el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} />
          ))}
        </Document>
      </div>

      <div className="d-flex position-relative align-center justify-center gap-2 ">
        <Button type="text" onClick={handleZoomOut} className="actions">
          <Minus className="icon-20-white cursor-pointer" />
        </Button>
        <Button type="text" onClick={handleZoomIn} className="actions">
          <Plus className="icon-20-white cursor-pointer" />
        </Button>
      </div>
    </div>
  );
}
