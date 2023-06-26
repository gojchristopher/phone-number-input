import { useCallback, useMemo, useState } from "react";

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

export function usePaginated<T>(array: T[], size = 25) {
	const chunks = useMemo(() => arrayChunk(array, size), [array, size]);

	const [page, setPage] = useState(1);
	const [rows, setRows] = useState<T[]>(chunks[0]);

	const more = useCallback(() => {
		if (page >= chunks.length) return;

		setPage((current) => current + 1);
		setRows((current) => {
			return [...current, ...chunks[page]];
		});
	}, [chunks, page]);

	return {
		rows,
		more,
		page,
		size,
	};
}
