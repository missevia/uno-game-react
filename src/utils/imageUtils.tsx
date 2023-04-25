import { allImages } from './cardUtils';

export function preloadImages(images: string[]): Promise<void[]> {
	return Promise.all(
		images.map((src) => {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				img.src = src;
				img.onload = () => resolve();
				img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
			});
		}),
	);
}

preloadImages(allImages)
	.then(() => console.log('All images preloaded.'))
	.catch((err) => console.error(err));