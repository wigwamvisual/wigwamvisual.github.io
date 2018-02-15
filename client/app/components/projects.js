import Masonry from 'masonry-layout';
import ImagesLoaded from 'imagesloaded';
import Gallery from '../modules/gallery';

import { getIndex, getParameterByName } from '../utils/helpers';

export default class Projects {

	constructor(context) {
		this.context = context;
		this.galleryEl = this.context.getElementsByClassName('projects__gallery')[0];
		this.gallery = new Gallery(this.galleryEl);
		this.projectIndex = 0;
		this.projectData = window.projects;

		this.init();
	}


	init() {
		const images = [].slice.call(this.context.querySelectorAll('.projects__item'));
		images.forEach(project => project.addEventListener("click", ::this.showGallery));
		
		ImagesLoaded(this.context, ::this.layoutGrid);

		const project = getParameterByName('project');
		if(project !== null) {
			this.showGallery(null, project);
		}
	}


	layoutGrid() {
		this.context.className += ' projects--show';
		const msnry = new Masonry(this.context, {
			itemSelector: '.projects__item',
			percentPosition: true,
			gutter: 22,
			transitionDuration: 0
		});
	}


	showGallery(e, project = false) {

		let slug = '';

		if(project) {
			slug = project;
		} else {
			const project = e.currentTarget;
			slug = project.getAttribute('data-slug');
			window.history.replaceState('', slug, `${window.location.href}?project=${slug}`);
		}

		const { images, title } =  this.projectData.filter(project => project.slug === slug)[0];
	
		if(images !== undefined) {
			this.galleryEl.classList.add('projects__gallery--show');
			this.gallery.init(images, title);
		}
	}
}
