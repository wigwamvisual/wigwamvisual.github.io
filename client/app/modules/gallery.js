import GalleryTemplate from '../../templates/gallery.pug';
import Vimeo from '@vimeo/player';
import { removeURLParameter } from '../utils/helpers';

export default class Gallery {

	constructor(context) {
		this.context = context;
		
		// DOM Elements
		this.progressIndicator = null;
		this.galleryItems = null;
		this.closeButton = null

		// Project data
		this.images = '';
		this.title = '';
		this.description = '';
		this.captions = [];

		// Gallery data
		this.currentIndex = 0;
		this.maxIndex = 0;
		this.boundary = window.innerWidth / 2;
		this.mouseX = 0;

	}


	init(images, title) {
		this.images = images
		this.title = title;
		this.currentIndex = 0;

		this.appendPartial();

		this.closeButton.addEventListener('click', ::this.closeGallery);
	}


	appendPartial() {
		const locals = { images: this.images, title: this.title };
		const partial = GalleryTemplate(locals);

		this.context.innerHTML = partial;
		this.gallery = this.context.getElementsByClassName('gallery__items')[0];
		this.galleryItems = this.context.getElementsByClassName('gallery__item');
		this.closeButton = this.context.getElementsByClassName('gallery__close')[0];
		this.currentItem = this.context.getElementsByClassName('gallery__current-item')[0];
		this.numItems = this.context.getElementsByClassName('gallery__num-items')[0]; 
		this.galleryNav = this.context.getElementsByClassName('gallery__nav');
		

		this.video = this.context.querySelector('.gallery__video');

		if(this.video != null) {
			this.vimeoPlayer = new Vimeo(this.video);
			this.playButtons = [...this.context.getElementsByClassName('gallery__play-button')];
			this.videoPoster = this.context.getElementsByClassName('gallery__image--video')[0];
			this.playButtons.forEach(button => button.addEventListener('click', ::this.playPauseVideo));
		}

		this.panorama = this.context.querySelector('.gallery__panorama');
		

		this.loadImages();
	}



	loadImages() {
		this.images.map( (src, i) => {
			const img = new Image();
			const el = this.galleryItems[i];
			img.src = src.url;
			img.onload = () => el.className += ' gallery__item--loaded';
		});

		this.galleryItems[this.currentIndex].className += ' gallery__item--active';
		this.maxIndex = this.galleryItems.length - 1;

		const nav = [].slice.call(this.galleryNav)
		nav.map( nav => 
			nav.addEventListener("click", ::this.updateGallery)
		);

	}


	updateGallery(e) {
		this.galleryItems[this.currentIndex].className = 'gallery__item gallery__item--loaded';

		if(this.video != null) {
			this.vimeoPlayer.pause();
		}

		if(e.clientX >= this.boundary) {
			this.currentIndex++;
		} else {
			this.currentIndex--;
		}

		if(this.currentIndex > this.maxIndex)
			this.currentIndex = 0;
		else if (this.currentIndex < 0)
			this.currentIndex = this.maxIndex;

		const className = this.galleryItems[this.currentIndex].className;

		this.video = this.context.querySelectorAll('.gallery__video')[this.currentIndex];
		if(this.video != null) {
			this.vimeoPlayer = new Vimeo(this.video);
		}

		this.galleryItems[this.currentIndex].className = `${className} gallery__item--active`;
	}


	closeGallery() {
		if(this.video != null) {
			this.video = null;
			this.vimeoPlayer.pause();
		}
		
		this.context.classList.remove('projects__gallery--show');
		
		const url = removeURLParameter(window.location.href, 'project');
		window.history.replaceState('', 'Home', url);


		
		setTimeout( () => {
			this.galleryItems.innerHTML = '';
		}, 500);
	}


	playPauseVideo() {
		this.vimeoPlayer.play();
		this.videoPoster.className += ' gallery__image--hide';
		this.video.className += ' gallery__video--show';
	}
}
