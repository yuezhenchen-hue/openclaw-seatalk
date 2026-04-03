export function checkGroupAccess(params: {
	groupPolicy: string;
	groupAllowFrom?: string[];
	groupSenderAllowFrom?: string[];
	groupId: string;
	senderEmployeeCode: string;
	senderEmail?: string;
}): { allowed: boolean; reason?: string } {
	const {
		groupPolicy,
		groupAllowFrom,
		groupSenderAllowFrom,
		groupId,
		senderEmployeeCode,
		senderEmail,
	} = params;

	if (groupPolicy === "disabled") {
		return { allowed: false, reason: "groupPolicy is disabled" };
	}

	if (groupPolicy === "allowlist") {
		const list = groupAllowFrom ?? [];
		if (!list.includes(groupId)) {
			return { allowed: false, reason: `group ${groupId} not in groupAllowFrom` };
		}
	}

	if (groupSenderAllowFrom && groupSenderAllowFrom.length > 0) {
		const match = groupSenderAllowFrom.some((entry) => {
			const e = entry.trim();
			if (e === "*") return true;
			if (e === senderEmployeeCode) return true;
			if (senderEmail && e.toLowerCase() === senderEmail.toLowerCase()) return true;
			return false;
		});
		if (!match) {
			return {
				allowed: false,
				reason: `sender ${senderEmployeeCode} not in groupSenderAllowFrom`,
			};
		}
	}

	return { allowed: true };
}
