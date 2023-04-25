import {
	Card,
	CardValue,
	specialImages,
	frontImages,
	numberValues,
	allImages
} from './cardUtils';

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

export const getCardImageInfo = (
	card: Card
): { cardFrontSrc: string; valueSrc?: string; blankValueSrc?: string; isNumeric: boolean } => {
	const { color, value } = card;
	let cardFrontSrc = frontImages[color];
	let valueSrc;
	let blankValueSrc;
	let isNumeric = false;
      
	if (value === CardValue.Wild) {
		cardFrontSrc = specialImages.wild;
	} else if (numberValues.includes(value)) {
		isNumeric = true;
	} else {
		if (value === CardValue.DrawTwo) {
			valueSrc = specialImages.drawTwo[color as keyof typeof specialImages.drawTwo];
			blankValueSrc = specialImages.drawTwo.blank;
		} else if (value === CardValue.Reverse) {
			valueSrc = specialImages.reverse[color as keyof typeof specialImages.reverse];
			blankValueSrc = specialImages.reverse.blank;
		} else if (value === CardValue.Skip) {
			valueSrc = specialImages.skip[color as keyof typeof specialImages.skip];
			blankValueSrc = specialImages.skip.blank;
		} else if (value === CardValue.WildDrawFour) {
			valueSrc = specialImages.drawFour.colour;
			blankValueSrc = specialImages.drawFour.blank;
		}
	}
      
	return { cardFrontSrc, valueSrc, blankValueSrc, isNumeric };
};
