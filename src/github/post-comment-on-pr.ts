import { GITHUB_CONFIG, github } from './client';

export const postCommentOnPR = async (body: string) => {
	try {
		await github.rest.issues.createComment({ ...GITHUB_CONFIG, body });
	} catch (e) {
		console.error(`Error while posting comment on PR : ${e}`);
	}
};
