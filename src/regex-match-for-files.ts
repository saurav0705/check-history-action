import { ArtifactReponseTypeWithFileDiff } from './get-diff-files';

export type ArtifactFinalResponseStatus = ArtifactReponseTypeWithFileDiff & {
	shouldRun: boolean;
};

export const matchFile = (files: string[], pattern: string) => {
	const regex = new RegExp(pattern, 'i');
	return files.some((file) => {
		return regex.test(file);
	});
};

export const matchFileForResponse = (
	artifacts: ArtifactReponseTypeWithFileDiff[]
): ArtifactFinalResponseStatus[] => {
	return artifacts.map((artifact) => ({
		...artifact,
		shouldRun: artifact.diffFiles
			? matchFile(artifact.diffFiles, artifact.filesRegex)
			: true,
	}));
};
