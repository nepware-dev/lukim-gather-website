import React from 'react';
import ImageGallery from 'react-image-gallery';
import {HiOutlineX} from 'react-icons/hi';

import cs from '@utils/cs';

import 'react-image-gallery/styles/css/image-gallery.css';
import classes from './styles';

interface Props {
  images: any,
  galleryIndex: number,
  showGallery: boolean,
  toggleGalleryVisibility(showGallery: boolean): void;
}

const Gallery: React.FC<Props> = ({
  images, galleryIndex, showGallery, toggleGalleryVisibility,
}) => {
  const galleryImages = images.map(
    (item: {media: string}) => ({original: item?.media, thumbnail: item?.media}),
  );
  return (
    <div className={cs(classes.sliderContainer, [classes.hidden, !showGallery])}>
      <div className={classes.galleryIconWrapper}>
        <div
          className={classes.closeModalIcon}
          onClick={() => toggleGalleryVisibility(!showGallery)}
        >
          <HiOutlineX size={14} />
        </div>
      </div>
      <ImageGallery
        items={galleryImages}
        startIndex={galleryIndex}
        showPlayButton={false}
        thumbnailPosition='left'
      />
    </div>
  );
};

export default Gallery;
