import { useCallback, useEffect, useState } from "react";
import { countries } from "./countries";

export function arrayChunk<T extends Array<unknown>>(array: T, size: number) {
	const chunks: T[number][][] = [];
	const copy = [...array];

	const len = copy.length;
	const max = Math.ceil(len / size);
	let idx = 0;

	for (; idx < max; idx++) {
		chunks.push(copy.splice(0, size));
	}

	return chunks;
}

const countriesChunk = arrayChunk(countries, 25);

export function usePaginatedCountries(resetSignalToAvoidPerfIssues?: boolean) {
	const [page, setPage] = useState(1);
	const [rows, setRows] = useState(countriesChunk[0]);

	const more = useCallback(() => {
		if (page >= countriesChunk.length) return;

		setPage((current) => current + 1);
		setRows((current) => {
			return [...current, ...countriesChunk[page]];
		});
	}, [page]);

	useEffect(() => {
		if (resetSignalToAvoidPerfIssues) {
			setRows(countriesChunk[0]);
		}
	}, [resetSignalToAvoidPerfIssues]);

	return {
		rows,
		more,
	};
}

export function isScrollableY<T extends HTMLElement>(elem: T) {
	const hasScrollableContent = elem.scrollHeight > elem.clientHeight;

	const overflowYStyle = window.getComputedStyle(elem).overflowY;
	const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1;

	return hasScrollableContent && !isOverflowHidden;
}

export function isScrolledToBottom<T extends HTMLElement>(elem: T) {
	if (!isScrollableY(elem)) return true;

	const BUFFER = 16;

	return elem.scrollHeight - elem.scrollTop - elem.clientHeight <= 0 + BUFFER;
}
