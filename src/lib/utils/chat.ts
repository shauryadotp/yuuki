import type { Message as DBMessage, Document } from '$lib/server/db/schema';
import type { FileUIPart, UIMessage } from 'ai';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function toFilePart(url: string, mediaType: string, filename?: string): FileUIPart {
	return {
		type: 'file',
		url,
		mediaType,
		...(filename ? { filename } : {})
	};
}

export function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
	return messages.map((message) => {
		const parts = (message.parts as UIMessage['parts']) ?? [];
		const attachments = (message.attachments as Array<unknown>) ?? [];

		const filePartsFromAttachments: FileUIPart[] = attachments
			.map((attachment) => {
				if (!isRecord(attachment)) return null;

				// v6 FileUIPart persisted directly.
				if (
					attachment.type === 'file' &&
					typeof attachment.url === 'string' &&
					typeof attachment.mediaType === 'string'
				) {
					return toFilePart(
						attachment.url,
						attachment.mediaType,
						typeof attachment.filename === 'string' ? attachment.filename : undefined
					);
				}

				// Legacy attachment shape: { url, name, contentType }
				if ('url' in attachment) {
					const { url } = attachment;
					const filename = attachment.name;
					const mediaType = attachment.contentType;
					if (typeof url !== 'string' || typeof mediaType !== 'string') return null;
					return toFilePart(url, mediaType, typeof filename === 'string' ? filename : undefined);
				}

				return null;
			})
			.filter((part): part is FileUIPart => part !== null);

		const mergedParts = [...parts, ...filePartsFromAttachments];

		return {
			id: message.id,
			parts: mergedParts,
			role: message.role as UIMessage['role']
		};
	});
}

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
	const userMessages = messages.filter((message) => message.role === 'user');
	return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(documents: Array<Document>, index: number) {
	if (!documents) return new Date();
	if (index > documents.length) return new Date();

	return documents[index].createdAt;
}
