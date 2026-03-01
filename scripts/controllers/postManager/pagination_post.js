import { PostService } from "../../services/postService.js";
import { PostCategory } from "../../models/enums/postCategory.js";
import { PostStatus } from "../../models/enums/postStatus.js";
import { MediaTypes } from "../../mediaTypes/mediaTypes.js";
import { paginationControlVariables } from "./postManagerController.js";
import { dom } from "./postManagerController.js";
import { renderPostsAndUpdatePaginationControl } from "./postManagerController.js";
import { showToast } from "../../utils/toast.js";
import { valueSearch } from "./search_post.js";

dom.button_next_page.addEventListener('click', async () => {
	try {		
		const list = await fetchPosts(dom.page.currentPageNumber + 1);
		await renderPostsAndUpdatePaginationControl(list, true);
	}
	catch (e) {
		showToast({message: 'Não foi possível avançar para próxima página', type: 'error'});
	}
});

dom.button_previous_page.addEventListener('click', async () => {	
	const list = await fetchPosts(dom.page.currentPageNumber - 1);
	await renderPostsAndUpdatePaginationControl(list, true);
});

export async function fetchPosts(page) {
	try {
		if (valueSearch !== "") {
			return await PostService.searchByTitle(
				MediaTypes.JSON,
				{page: page, size: 4, direction: 'asc'},
				valueSearch
			);
		}
		else if (paginationControlVariables.filter.status === PostStatus.ALL && paginationControlVariables.filter.category === PostCategory.ALL) {
			return await PostService.findAllPostsPageable(
				MediaTypes.JSON, 
				{ page: page, size: 4, direction: 'asc' }
			);
		}
		else if (paginationControlVariables.filter.status === PostStatus.ALL && paginationControlVariables.filter.category !== PostCategory.ALL) {
			return await PostService.findAllPostsPageableByCategory(
				MediaTypes.JSON,
				{page: page, size: 4, direction: 'asc'},
				paginationControlVariables.filter.category,
			);
		}
		else if (paginationControlVariables.filter.status !== PostStatus.ALL && paginationControlVariables.filter.category === PostCategory.ALL) {
			return await PostService.findAllPostsPageableByStatus(
				MediaTypes.JSON,
				{page: page, size: 4, direction: 'asc'},
				paginationControlVariables.filter.status,
			);
		}
		else {
			return await PostService.findAllPostsPageableByStatusAndCategory(
				MediaTypes.JSON,
				{page: page, size: 4, direction: 'asc'},
				paginationControlVariables.filter.status,
				paginationControlVariables.filter.category,
			);
		}
	}
	catch (e) {
		return await PostService.findAllPostsPageable(
			MediaTypes.JSON, 
			{ page: page, size: 4, direction: 'asc' }
		);
	}
}