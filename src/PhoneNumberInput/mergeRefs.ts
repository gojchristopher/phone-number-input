type PossibleRef<T> = React.Ref<T> | undefined;

type Nil = null | undefined;

function isNil(subject: unknown): subject is Nil {
	return subject === undefined || subject === null;
}

function assign<T>(ref: PossibleRef<T>, value: T) {
	if (typeof ref === "function") {
		ref(value);
	} else if (!isNil(ref)) {
		(ref as React.MutableRefObject<T>).current = value;
	}
}

export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
	return (node: T) => refs.forEach((ref) => assign(ref, node));
}
