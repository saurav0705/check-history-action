import { GITHUB_CONFIG, github } from './client';

type DiffFilesType = {
	base: string;
	head: string;
};

export const getFileDiffFromGithub = async ({
	base,
	head,
}: DiffFilesType): Promise<string[]> => {
	const resp = await github.rest.repos.compareCommits({
		base,
		head,
		...GITHUB_CONFIG,
	});

	return resp.data.files?.map((item) => item.filename) ?? [];
};
