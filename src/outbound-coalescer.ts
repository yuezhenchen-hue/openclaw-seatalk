export type OutboundCoalescer = {
	append: (text: string) => void;
	flush: () => Promise<void>;
	hasBuffered: () => boolean;
};

export function createOutboundCoalescer(params: {
	send: (text: string) => Promise<void>;
	chunkText: (text: string, limit: number) => string[];
	maxLength: number;
	joiner: string;
	idleFlushMs?: number;
}): OutboundCoalescer {
	const { send, chunkText, maxLength, joiner, idleFlushMs } = params;

	let buffer = "";
	let idleTimer: ReturnType<typeof setTimeout> | undefined;
	let sendChain: Promise<void> = Promise.resolve();

	const clearIdleTimer = () => {
		if (!idleTimer) return;
		clearTimeout(idleTimer);
		idleTimer = undefined;
	};

	const sendBuffered = () => {
		if (!buffer) return;
		const text = buffer;
		buffer = "";
		const chunks = text.length > maxLength ? chunkText(text, maxLength) : [text];
		const doSend = async () => {
			for (const chunk of chunks) {
				await send(chunk);
			}
		};
		// Use rejection handler to recover from prior failures so the chain never stays broken.
		sendChain = sendChain.then(doSend, doSend);
		// Prevent unhandled-rejection warnings when triggered by idle timer.
		sendChain.catch(() => {});
	};

	const scheduleIdleFlush = () => {
		if (!idleFlushMs || idleFlushMs <= 0) return;
		clearIdleTimer();
		idleTimer = setTimeout(() => {
			idleTimer = undefined;
			sendBuffered();
		}, idleFlushMs);
	};

	const append = (text: string) => {
		if (!text) return;
		clearIdleTimer();

		if (!buffer) {
			buffer = text;
			scheduleIdleFlush();
			return;
		}

		const next = `${buffer}${joiner}${text}`;
		if (next.length > maxLength) {
			sendBuffered();
			buffer = text;
			scheduleIdleFlush();
			return;
		}

		buffer = next;
		scheduleIdleFlush();
	};

	const flush = async () => {
		clearIdleTimer();
		sendBuffered();
		await sendChain;
	};

	return {
		append,
		flush,
		hasBuffered: () => buffer.length > 0,
	};
}
