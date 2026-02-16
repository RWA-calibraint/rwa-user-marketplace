'use client';

import { Image } from 'antd';
import { X } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import './draggable-image.scss';
import { DraggableImageInterface, DraggableUploadListInterface } from './draggable.interface';

export const DraggableUploadList: FC<DraggableUploadListInterface> = ({ fileList, moveImage, setFileList }) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'MEDIA',
    hover(item: { index: number }) {
      const dragIndex = item.index;
      const hoverIndex = item.index;

      if (dragIndex === hoverIndex) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drop(dropRef);

  return (
    <div ref={dropRef} className="d-flex flex-wrap draggable-image">
      {fileList?.map((file, index) => (
        <DraggableMedia
          key={file?.uid}
          file={file}
          index={index}
          moveImage={moveImage}
          isFirst={index === 0}
          onRemove={(indexToRemove) => {
            setFileList((prevState) => {
              const updatedList = [...prevState];

              updatedList.splice(indexToRemove, 1);

              return updatedList;
            });
          }}
        />
      ))}
    </div>
  );
};

const DraggableMedia: FC<DraggableImageInterface> = ({ file, index, moveImage, isFirst, onRemove }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: 'MEDIA',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'MEDIA',
    hover(item: { index: number }) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [enableCrossIcon, setEnableCrossIcon] = useState(false);
  const [hover, setHover] = useState<boolean>(false);

  useEffect(() => {
    if (file?.originFileObj) {
      const objectURL = URL.createObjectURL(file.originFileObj);

      setPreviewURL(objectURL);

      return () => URL.revokeObjectURL(objectURL);
    } else if (file.url) {
      setPreviewURL(file.url);
    }
  }, [file]);

  const isVideo =
    (file.type && file.type.includes('video')) || (file.name && file.name.match(/\.(mp4|webm|ogg|mov|m4v|mkv|avi)$/i));

  const isImage =
    !isVideo &&
    ((file.type && file.type.includes('image')) ||
      (file.name && file.name.match(/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i)));

  if (!previewURL && !file.thumbUrl && !file.url) return <p>No preview available</p>;

  return (
    <div
      ref={ref}
      className="position-relative border-brand-1 w-90 h-90 radius-4 m-t-16 m-r-16 draggable-img cursor-pointer"
      onMouseEnter={() => setEnableCrossIcon(true)}
      onMouseLeave={() => setEnableCrossIcon(false)}
    >
      {isImage && (
        <Image
          src={previewURL || file.thumbUrl || file.url}
          alt={file.name}
          width={90}
          height={90}
          className="img-fit-contain"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      )}
      {isVideo && (
        <video
          src={previewURL || file.url}
          width={90}
          height={90}
          controls
          className="img-fit-contain"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      )}
      {!isImage && !isVideo && (
        // Fallback for any other file type
        <div
          className="d-flex align-center justify-center"
          style={{ width: 90, height: 90 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <p className="f-12-14-400-primary">{file.name}</p>
        </div>
      )}
      {isFirst && (
        <p className="position-absolute bottom-0 bg-cover f-12-14-400-white p-4 width-100 radius-4 z-index-1 d-flex align-center justify-center">
          Cover
        </p>
      )}
      <button
        className="position-absolute top-0 right-0 main-button cursor-pointer img-22 radius-2 bg-black d-none cancel"
        onClick={() => onRemove(index)}
      >
        {enableCrossIcon && <X className={`img-16 m-4 ${hover ? 'f-14-20-400-white' : 'f-14-20-400-primary'}`} />}
      </button>
    </div>
  );
};
