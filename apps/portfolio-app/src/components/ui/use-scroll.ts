'use client';
import React from 'react';

export function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);
	const frameRef = React.useRef<number | null>(null);

	const onScroll = React.useCallback(() => {
		if (frameRef.current !== null) {
			return;
		}

		frameRef.current = window.requestAnimationFrame(() => {
			setScrolled(window.scrollY > threshold);
			frameRef.current = null;
		});
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			if (frameRef.current !== null) {
				window.cancelAnimationFrame(frameRef.current);
			}
		};
	}, [onScroll]);

	// also check on first load
	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}
